from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from .serializers import TireSerializer, TransactionSerializer
# from .serializers import ReservedTireSerializer, HotelTireSerializer 
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Tire, Transaction
# from .models import ReservedTire, HotelTire
# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class TireList(generics.ListCreateAPIView):
    serializer_class = TireSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Tire.objects.all()
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)
    
class TireDelete(generics.DestroyAPIView):
    serializer_class = TireSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        tire_id = self.request.tire_id
        return Tire.objects.filter(id=tire_id)
    