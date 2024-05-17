from django.urls import path
from . import views
from . import dashboard_views

urlpatterns = [
    path("tires/", views.TireList.as_view(), name="tire-list"),
    path("tires/delete/<int:pk>", views.TireDelete.as_view(), name="delete-tire"),
    
    path('download_excel/', views.download_excel, name='download_excel'),
    path('download_pdf/', views.download_pdf, name='download_pdf'),

    path("filter/", views.filter_tires, name="filter_tires"),
    path('filter/reserved/', views.filter_tires, {'reserved': True}, name='filter_reserved_tires'),
    path('filter/hotel/', views.filter_tires, {'hotel': True}, name='filter_hotel_tires'),
    
    path("reserved_tires/", views.get_reserved_tires, name="get_reserved_tires"),
    path("hotelTires/", views.get_hotel_tires, name="get_hotel_tires"),
    
    path('createTire/', views.create_tire, name="create_tire"),
    path('createHotelTire/', views.create_hotel_tire, name="create_hotel_tire"),

    path('patchTires/<int:tire_id>/', views.update_tire, name='update_tire'),
    
    path('sellTire/<int:tire_id>/', views.sell_tire, name='sell_tire'),
    path('addTireStock/<int:tire_id>/', views.add_tire_stock, name='add_tire_stock'),

    path('reserveTire/<int:tire_id>/', views.reserve_tire, name='reserve_tire'),
    path('unReserveTire/<int:tire_id>/', views.unreserve_tire, name='unreserve_tire'),
    path('removeHotelTire/<int:tire_id>/', views.remove_hotel_tire, name='remove_hotel_tire'),

    path('getEntries/<str:start_date>/<str:end_date>/', dashboard_views.get_entries, name='get_entries'),
    path('getSales/<str:start_date>/<str:end_date>/', dashboard_views.get_sales, name='get_sales'),
    path('getReservations/<str:start_date>/<str:end_date>/', dashboard_views.get_reservations, name='get_reservations'),
]