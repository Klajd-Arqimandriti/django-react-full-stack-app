from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from .views import FieldsAPIView
from .views import HotelFieldsAPIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),
    path('api/fields/', FieldsAPIView.as_view(), name='fields_api'),
    path('api/hotel/fields/', HotelFieldsAPIView.as_view(), name='hotel_fields_api'),
]
