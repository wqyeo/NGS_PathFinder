from django.contrib import admin
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('admin/', admin.site.urls),
    path("add-minerals/", views.add_mineral_node, name="add-mineral")
]
