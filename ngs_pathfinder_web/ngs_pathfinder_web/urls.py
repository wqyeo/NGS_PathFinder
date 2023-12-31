from django.contrib import admin
from django.urls import path

from . import views

urlpatterns = [
    #path("add-node/", views.add_node, name="add-node"),
    # path("add-minerals/", views.add_mineral_node, name="add-mineral"),
    path("generate-graph/", views.create_heu_graph, name="gen-graph"),
    path("", views.index, name="index"),
    path("admin/", admin.site.urls),
    path("do-pathfind/", views.do_pathfind, name="do-pathfind"),
]
