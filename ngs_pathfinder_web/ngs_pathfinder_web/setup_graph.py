import os
import json
import math
from django.conf import settings

# NOTE: For color printing
END = "\033[0m"
RED = "\033[31m"
BLUE = "\033[34m"
GREEN = "\033[32m"
YELLOW = "\033[33m"


class _GraphNode:

    def __init__(self, node_id: str, lat: float, lng: float, region: str):
        self.node_cost_ref = {}
        self.region = region
        self.lat = lat
        self.lng = lng
        self.node_id = node_id


class _NodeReference:

    def __init__(self, lat: float, lng: float, cost: float, can_teleport: bool):
        self.lat = lat
        self.lng = lng
        self.cost = cost
        self.can_teleport = can_teleport


class _Marker:

    def __init__(
        self, node_id: str, lat: float, lng: float, can_teleport: bool, region: str
    ):
        self.node_id = node_id
        self.lat = lat
        self.lng = lng
        self.can_teleport = can_teleport
        self.region = region


def _get_map_markers() -> list[_Marker]:
    # (Path to data file; Teleportable)
    data_file_teleportable = [
        ("data/advTrainia.json", True),
        ("data/cocoons.json", True),
        ("data/battledias.json", True),
        ("data/ryukers.json", True),
        ("data/towers.json", True),
        ("data/mags.json", True),
        ("data/minerals/dualomite.json", False),
        ("data/minerals/pentalite.json", False),
        ("data/minerals/photonchunk.json", False),
        ("data/minerals/photonquartz.json", False),
        ("data/minerals/trinite.json", False),
    ]

    map_markers = []

    # Open every file
    for data_file_teleport in data_file_teleportable:
        file_path = os.path.join(settings.STATIC_URL, data_file_teleport[0])
        print(BLUE + "Opening file " + file_path + "..." + END)

        with open(file_path, "r", encoding="utf-8") as file:
            markers_data = json.load(file)
            print(BLUE + "File loaded successfully to JSON, reading markers..." + END)

            # Add append every marker data from file.
            for data in markers_data:
                node_id = data["id"]
                lat = data["lat"]
                lng = data["lng"]
                can_teleport = data_file_teleport[1]
                region = data["region"]
                map_marker_data = _Marker(
                    node_id, lat, lng, can_teleport, region)
                map_markers.append(map_marker_data)
                print("Appended Marker: " + data["id"])
        return map_markers


def _calculate_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    return math.sqrt((lat2 - lat1) ** 2 + (lng2 - lng1) ** 2)


def _gather_in_radius(
    current_node_ref: _GraphNode, map_markers: list[_Marker], radius: float
) -> bool:
    """
    Modifies the current node by reference to include
    the search results in given radius.

    Additionally, returns True if a search result is
    a structure that can be teleported into.
    """
    found_teleportable_in_range = False
    for marker in map_markers:
        # Current node is self, ignore
        if marker.node_id == current_node_ref.node_id:
            continue
        # Already included in path...
        if marker.node_id in current_node_ref.node_cost_ref:
            continue

        distance = _calculate_distance(
            current_node_ref.lat, current_node_ref.lng, marker.lat, marker.lng
        )
        # Not within search radius, ignore
        if radius < distance:
            continue

        if marker.can_teleport:
            found_teleportable_in_range = True

        # Cost to traverse is simply the distance.
        # NOTE: The pathfinder algorithm will factor in additional cost for teleporting.
        connected_node = _NodeReference(
            marker.lat, marker.lng, distance, marker.can_teleport
        )

        # Add to list of possible nodes to traverse to.
        current_node_ref.node_cost_ref[marker.node_id] = connected_node
        print("(" + current_node_ref.node_id + ")" +
              "Added node: " + marker.node_id)

    return found_teleportable_in_range


def _create_heu_graph():
    """
    Create heuristic graph consisting of all the nodes present
    in the current dataset.
    """
    map_markers: list[_Marker] = _get_map_markers()
    print(GREEN + "Loaded all map markers data." + END)

    graph_nodes = {}
    print(BLUE + "Creating heuresitic graph nodes..." + END)
    for marker in map_markers:
        current_node = _GraphNode(
            marker.node_id, marker.lat, marker.lng, marker.region)
        print("Searching node reference for node " + marker.node_id)

        has_sufficient_node_ref = False
        gather_radius = 5.0
        while not has_sufficient_node_ref:
            has_sufficient_node_ref = _gather_in_radius(
                current_node, map_markers, gather_radius
            )
            gather_radius += 5.0

        # Gather one last time with expanded search radius
        _gather_in_radius(current_node, map_markers, gather_radius)
        graph_nodes[marker.node_id] = current_node

    print(BLUE + "Done creating heuresitic graph..." + END)
    return graph_nodes


def generate_heu_graph_data():
    """
    Generate a data file, containing a heurestic graph
    for the world map.
    """
    heu_graph = _create_heu_graph()
    graph_json = json.dumps(heu_graph)

    file_path = os.path.join(settings.STATIC_URL, "heu_graph_data.json")
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(graph_json)
