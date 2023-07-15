import json
import os
import gzip
import io

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
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

    minerial_id = name_id + str(len(data))
    insertion = {
        "id": minerial_id,
        "type": mineral_type,
        "lat": lat,
        "lng": lng,
        "region": region,
    }
    data.append(insertion)

    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=2, ensure_ascii=False)


def _save_node_data(
    name_id: str, node_height: float, lat: float, lng: float, region: str
) -> None:
    file_path = os.path.join("static/data", "pathNodes.json")

    data = []
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            data = json.load(file)
    except FileNotFoundError:
        data = []
        print("File for adding nodes doesn't exist... creating new entry")

    node_id = name_id + str(len(data))
    insertion = {
        "id": node_id,
        "height": node_height,
        "lat": lat,
        "lng": lng,
        "region": region,
    }
    data.append(insertion)

    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=2, ensure_ascii=False)


def index(request):
    return render(request, "main.html")


def add_node(request):
    name_id = request.GET.get("nameId")
    height = float(request.GET.get("height"))
    lat = float(request.GET.get("lat"))
    lng = float(request.GET.get("lng"))
    region = request.GET.get("region")

    _save_node_data(name_id, height, lat, lng, region)

    response_data = {"result": "OK"}
    return JsonResponse(response_data)


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
        if (len(data)) <= 1:
            print("Had nothing in data!")
            return JsonResponse({"paths": None})

        shortest_path = find_shortest_path(data)

        return JsonResponse({ "result": shortest_path})
    print("JSON Response isn't a POST request!")
    return JsonResponse({"paths": None})


def create_heu_graph(request):
    generate_heu_graph_data()
    return JsonResponse({"status": "OK"})
