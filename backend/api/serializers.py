from django.contrib.auth.models import User
from rest_framework import serializers


from .models import Tire
from .models import Transaction
from .models import ReservedTire
from .models import HotelTire


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    

class TireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tire
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


class ReservedTireSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservedTire
        fields = '__all__'


class HotelTireSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelTire
        fields = '__all__'
