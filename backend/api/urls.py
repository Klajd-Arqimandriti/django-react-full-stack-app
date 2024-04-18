from django.urls import path
from . import views

urlpatterns = [
    path("tires/", views.TireList.as_view(), name="tire-list"),
    path("tires/delete/<int:pk>", views.TireDelete.as_view(), name="delete-tire"),
]