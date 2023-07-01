from django.contrib import admin
from django.urls import path

from . import views

urlpatterns = [
    #path("add-minerals/", views.add_mineral_node, name="add-mineral")
    path("", views.index, name="index"),
    path('admin/', admin.site.urls),
    path("do-pathfind/", views.do_pathfind, name="do-pathfind")    
]
