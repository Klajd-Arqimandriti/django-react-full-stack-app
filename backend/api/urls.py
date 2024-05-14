from django.urls import path
from . import views

urlpatterns = [
    path("tires/", views.TireList.as_view(), name="tire-list"),
    path("tires/delete/<int:pk>", views.TireDelete.as_view(), name="delete-tire"),
    path("filter/", views.filter_tires, name="filter_tires"),
    path("reserved_tires/", views.get_reserved_tires, name="get_reserved_tires"),
    path("hotelTires/", views.get_hotel_tires, name="get_hotel_tires"),
    
    path('sellTire/<int:tire_id>/', views.sell_tire, name='sell_tire'),
    path('addTireStock/<int:tire_id>/', views.add_tire_stock, name='add_tire_stock'),

    path('reserveTire/<int:tire_id>/', views.reserve_tire, name='reserve_tire'),
    path('unReserveTire/<int:tire_id>/', views.unreserve_tire, name='unreserve_tire'),
]