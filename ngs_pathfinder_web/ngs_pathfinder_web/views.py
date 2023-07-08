import json
import os
import gzip
import io

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from .node import Node
from .pathfinder import find_shortest_path
from .setup_graph import generate_heu_graph_data


def _save_mineral_data(
    name_id: str, mineral_type: str, lat: float, lng: float, region: str
) -> None:
    file_path = os.path.join("static/data/minerals", name_id + ".json")

    data = []
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            data = json.load(file)
    except FileNotFoundError:
        data = []
        print("File for adding mineral doesn't exist... creating new entry")

    id = name_id + str(len(data))
    insertion = {
        "id": id,
        "type": mineral_type,
        "lat": lat,
        "lng": lng,
        "region": region,
    }
    data.append(insertion)

    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=2, ensure_ascii=False)


def index(request):
    return render(request, "main.html")


def add_mineral_node(request):
    name_id = request.GET.get("nameId")
    mineral_type = request.GET.get("type")
    lat = request.GET.get("lat")
    lng = request.GET.get("lng")
    region = request.GET.get("region")

    _save_mineral_data(name_id, mineral_type, lat, lng, region)

    response_data = {"result": "OK"}
    return JsonResponse(response_data)


def do_pathfind(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print(data)
        if (len(data)) <= 1:
            return JsonResponse({"paths": None})

        nodes = []
        for key, value in data.items():
            new_node = Node(
                key, value["lat"], value["lng"], value["category"], value["region"]
            )
            nodes.append(new_node)

        # Do a simple, dummy pathfinding for now.
        shortest_path = find_shortest_path(nodes)

        result = []
        for node in shortest_path:
            node_dict = {
                "id": node.get_id(),
                "lat": node.get_lat(),
                "lng": node.get_lng(),
                "category": node.get_category(),
                "region": node.get_region(),
            }
            result.append(node_dict)
        return JsonResponse({"paths": result})
    return JsonResponse({"paths": None})


def create_heu_graph(request):
    generate_heu_graph_data()
    return JsonResponse({"status": "OK"})
