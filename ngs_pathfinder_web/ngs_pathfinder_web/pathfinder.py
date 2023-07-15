import os
import json
import math

class _Node:
    def __init__(self, node_id: str, lat: float, lng: float, height: float, region: str, node_references: list):
        self.node_id = node_id
        self.lat = float(lat)
        self.lng = float(lng)
        self.height = float(height)
        self.region = region
        self.node_reference = node_references

    def find_closest_teleporter(self) -> dict:
        # Find closest teleporter to a node
        least_cost = 99999999999.99
        least_cost_node = {}
        for ref in self.node_reference:
            current_cost = float(ref["cost"])
            if current_cost < least_cost:
                least_cost = current_cost
                least_cost_node = ref
        return ref

def _get_pathfind_nodes_data(input: list[str], heu_graph) -> dict:
    # Get all data of nodes to pathfind through.
    pathfind_nodes = {}
    for node_id in input:
        if not node_id in heu_graph:
            print("Node ID of " + str(node_id) + " not found in graph! Skipping...")
            continue

        node_data = heu_graph[node_id]
        pathfind_nodes[node_id] = _Node(node_id, node_data["lat"], node_data["lng"], node_data["height"], node_data["region"], node_data["node_cost_ref"])
        print("Node ID of " + str(node_id) + " was successfully appended...")
    return pathfind_nodes

def _find_starting_node(pathfind_nodes: dict) -> _Node:
    # Start pathfinding from the most corner of the map.
    starting_node = next(iter(pathfind_nodes.values()))
    closest_to_zero = math.sqrt(starting_node.lat ** 2 + starting_node.lng ** 2)

    for node_id, node in pathfind_nodes.items():
        distance_to_zero = math.sqrt(node.lat ** 2 + node.lng ** 2)
        if closest_to_zero > distance_to_zero:
            starting_node = node
            closest_to_zero = distance_to_zero
    return starting_node

def _load_heu_graph() -> dict:
    heu_graph_data = None
    file_path = os.path.join("static/", "heu_graph_data.json")
    with open(file_path, "r", encoding="utf-8") as file:
        heu_graph_data = json.load(file)
    return heu_graph_data

def _query_path_node_reachable(path_node_id: str, destination_node: _Node, heu_graph_ref: dict, recursive_list: list) -> list:
    
    return recursive_list

def _query_fastest_path_to(from_node: _Node, to_node_query: _Node, heu_graph_ref: dict) -> list:
    
    # NOTE: The reference query is already sorted by cost, in ascending order
    fastest_path = None
    fastest_direct_path_found = False
    for node_ref in to_node_query.node_reference:
        if not fastest_direct_path_found:
            # Fastest path is just to run there
            if node_ref["node_id"] == from_node.node_id:
                fastest_direct_path_found = True
                fastest_path = [
                {
                    "lat": to_node_query.lat,
                    "lng": to_node_query.lng
                }]
            # Fastest route is to teleport to a nearby device, then run
            if node_ref["can_teleport"] == True:
                fastest_direct_path_found = True
                fastest_path = [
                    {
                        "lat": node_ref["lat"],
                        "lng": node_ref["lng"],
                        "tp": True
                    }
                    , {
                    "lat": to_node_query.lat,
                    "lng": to_node_query.lng
                }]
        # TODO: Consider if something is a path node
        
        if node_ref["is_path_node"]:
            _query_path_node_reachable(node_ref["node_id"], from_node, heu_graph_ref, [])

    
    return fastest_path

def _set_best_next_node(current_node: _Node, to_traverse: dict, heu_graph_ref: dict, result: list) -> _Node:
    # Find possible node from it's list of references
    next_possible_node: _Node = None
    next_possible_cost = 99999999.99
    for node_ref in current_node.node_reference:
        if not node_ref["node_id"] in to_traverse:
            continue
        
        if node_ref["cost"] < next_possible_cost:
            next_possible_cost = node_ref["cost"]
            next_possible_node = to_traverse[node_ref["node_id"]]
    
    # Next possible node is in it's list of references
    if next_possible_node != None:
        # Direct pathfind to the node.
        fastest_path_list = _query_fastest_path_to(current_node, next_possible_node, heu_graph_ref)
        for next_path in fastest_path_list:
            result.append(next_path)
        # Return the node traversed to
        return next_possible_node

    # Helper inner function to calculate distance between 2 nodes
    def calculate_distance(node_a: _Node, node_b: _Node) -> float:
        dist_lat = node_a.lat - node_b.lat
        dist_lng = node_a.lng - node_b.lng
        return math.sqrt(dist_lat ** 2 + dist_lng ** 2)

    # No nodes to traverse towards are near the current node,
    # find the closest node from the possible traverse dictionary
    next_possible_node: _Node = None
    next_possible_cost = 99999999.99
    for node_id, node_data in to_traverse.items():
        distance = calculate_distance(current_node, node_data)
        if distance < next_possible_cost:
            next_possible_cost = distance
            next_possible_node = node_data
    
    fastest_teleport = next_possible_node.find_closest_teleporter()

    # Teleport first
    result.append({
        "lat": fastest_teleport["lat"],
        "lng": fastest_teleport["lng"],
        "tp": True
    })
    # Then move to desired node
    result.append({
        "lat": next_possible_node.lat,
        "lng": next_possible_node.lng
    })

    return next_possible_node

def find_shortest_path(input) -> list:
    heu_graph = _load_heu_graph()

    if heu_graph == None:
        print("Failed to load Heurestic Graph")
        return None

    print("Loaded heurestic graph...")
    print("Found " + str(len(input)) + " nodes to pathfind...")

    pathfind_nodes = _get_pathfind_nodes_data(input, heu_graph)

    result = []

    # Fetch a first node
    current_node = _find_starting_node(pathfind_nodes)

    # Start from the very first teleporter closest to the first node
    starting_point = current_node.find_closest_teleporter()
    result.append({
        "lat": float(starting_point["lat"]),
        "lng": float(starting_point["lng"])
    })
    # then go to the first node
    result.append({
        "lat": float(current_node.lat),
        "lng": float(current_node.lng)
    })

    # Reached node, remove from list of nodes to traverse
    pathfind_nodes.pop(current_node.node_id)
    while len(pathfind_nodes) >= 1:
        print("Traversed to node " + current_node.node_id)
        current_node = _set_best_next_node(current_node, pathfind_nodes, heu_graph, result)
        pathfind_nodes.pop(current_node.node_id)
    print("Traversed to node " + current_node.node_id)

    print("Completed pathfinding that has a node lenght of " + str(len(result)))
    return result