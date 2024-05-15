from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Tire
from .models import ReservedTire
from .models import Transaction
from .models import HotelTire

from .serializers import UserSerializer

from .serializers import TireSerializer
from .serializers import TransactionSerializer
from .serializers import ReservedTireSerializer
from .serializers import HotelTireSerializer

from rest_framework.permissions import IsAuthenticated, AllowAny

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


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
    

@csrf_exempt
@api_view(['GET'])
def filter_tires(request, reserved=False):

    # Text input based filtering
    if 'filter/reserved/' in request.path:
        location = request.query_params.get('location')
        customer_name = request.query_params.get('customer_name')
        print(f"Customer Name: {customer_name}")
        reserved = True
    else:
        rim = request.query_params.get('rim')
        code = request.query_params.get('code')
        brand = request.query_params.get('brand')
        pattern = request.query_params.get('pattern')
        tire_size = request.query_params.get('tire_size')
        tire_size_1 = request.query_params.get('tire_size_1')

        # Dropdown input based filtering
        season = request.query_params.get('season')
        car_type = request.query_params.get('car_type')
        location = request.query_params.get('location')

    if not reserved:
        queryset = Tire.objects.all()
        if rim:
            queryset = queryset.filter(rim__istartswith=rim)
        if code:
            queryset = queryset.filter(code__istartswith=code)
        if brand:
            queryset = queryset.filter(brand__istartswith=brand)
        if pattern:
            queryset = queryset.filter(pattern__istartswith=pattern)
        if tire_size:
            queryset = queryset.filter(tire_size__istartswith=tire_size)
        if tire_size_1:
            queryset = queryset.filter(tire_size_1__istartswith=tire_size_1)

        # Dropdown input based filtering
        if season:
            queryset = queryset.filter(season__istartswith=season)
        if car_type:
            queryset = queryset.filter(car_type__istartswith=car_type)
        if location:
            queryset = queryset.filter(location__istartswith=location)            

        serializer = TireSerializer(queryset, many=True)

    else:
        queryset = ReservedTire.objects.all()
        if location:
            queryset = queryset.filter(location__istartswith=location)
        if customer_name:
            queryset = queryset.filter(customer_name__icontains=customer_name)

        serializer = ReservedTireSerializer(queryset, many=True)

    return JsonResponse(serializer.data, safe=False)

@csrf_exempt
@api_view(['GET'])
def get_reserved_tires(request):
    if request.method == 'GET':
        reserved_tires = ReservedTire.objects.filter(reserved_amount__isnull=False, reserved_amount__gt=0)
        reserved_serializer = ReservedTireSerializer(reserved_tires, many=True)

        # Load tire serializer data into a dictionary for efficient lookup
        tire_objects = Tire.objects.filter(id__in=[item['tire'] for item in reserved_serializer.data])
        tire_serializer = TireSerializer(tire_objects, many=True)
        tire_data_map = {tire['id']: tire for tire in tire_serializer.data}

        # Update reserved tires with tire data
        for reserved_tire in reserved_serializer.data:
            tire_id = reserved_tire['tire']
            tire_serializer_data = tire_data_map.get(tire_id)

            if tire_serializer_data:
                reserved_tire['rim'] = tire_serializer_data.get('rim')
                reserved_tire['code'] = tire_serializer_data.get('code')
                reserved_tire['brand'] = tire_serializer_data.get('brand')
                reserved_tire['pattern'] = tire_serializer_data.get('pattern')
                reserved_tire['width'] = tire_serializer_data.get('width')
                reserved_tire['ratio'] = tire_serializer_data.get('ratio')
                reserved_tire['price'] = tire_serializer_data.get('price')
                reserved_tire['car_type'] = tire_serializer_data.get('car_type')
                reserved_tire['location'] = tire_serializer_data.get('location')

        return Response(reserved_serializer.data, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['GET'])
def get_hotel_tires(request):
    if request.method == 'GET':
        hotel_tires = HotelTire.objects.filter(amount__isnull=False, amount__gt=0)
        hotel_serializer = HotelTireSerializer(hotel_tires, many=True)

        return Response(hotel_serializer.data, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['POST'])
def reserve_tire(request, tire_id):
    if request.method == 'POST':
        reserved_quantity = int(request.data.get('reservedQuantity'))
        customer_name = request.data.get('customerName')
        contact_phone = request.data.get('contactPhone')

        try:
            tire = Tire.objects.get(id=tire_id)
            if reserved_quantity <= tire.stock:

                if tire.reserved_amount == None:
                    tire.reserved_amount = 0

                tire.reserved_amount += reserved_quantity
                tire.stock -= reserved_quantity
                tire.save()

                Transaction.objects.create(
                    tire_id=tire,
                    transaction_type='Reservation',
                    tire_amount=reserved_quantity,
                    customer_name=contact_phone,
                    contact_phone=contact_phone
                )

                ReservedTire.objects.create(
                    tire_id=tire_id,
                    reserved_amount=reserved_quantity,
                    customer_name=customer_name,
                    contact_phone=contact_phone
                )

                return JsonResponse({'message': f'Tire reserved successfully with {reserved_quantity} units'}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({'message': 'Not enough quantity available'}, status=status.HTTP_400_BAD_REQUEST)
        except Tire.DoesNotExist:
            return JsonResponse({'message': 'Tire not found'}, status=status.HTTP_404_NOT_FOUND)
    else:
        print('This is a GET request.')
        return JsonResponse({'message': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@csrf_exempt
@api_view(['POST'])
def unreserve_tire(request, tire_id):
    if request.method == 'POST':
        try:
            reserved_tire = ReservedTire.objects.get(id=tire_id)
            tire_id = reserved_tire.tire_id
            tire = Tire.objects.get(id=tire_id)
            tire.stock += reserved_tire.reserved_amount
            tire.save()
            reserved_tire.delete()
            return JsonResponse({'message': 'Tire unreserved successfully'}, status=status.HTTP_200_OK)
        except Tire.DoesNotExist:
            return JsonResponse({'message': 'Tire not found'}, status=status.HTTP_404_NOT_FOUND)
    else:
        print('This is a GET request.')
        return JsonResponse({'message': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
@csrf_exempt
@api_view(['POST'])
def sell_tire(request, tire_id):
    if request.method == 'POST':
        pathname = request.data.get('pathname')
        customer_name = request.data.get('customerName')
        contact_phone = request.data.get('contactPhone')
        if pathname == '/reserved-tires':
            try:
                    reserved_tire = ReservedTire.objects.get(id=tire_id)
                    sell_quantity = int(request.data.get('sellQuantity'))

                    if sell_quantity > reserved_tire.reserved_amount:
                        return JsonResponse({'message': 'Invalid amount. Sell quantity exceeds reserved amount.'}, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        reserved_tire.reserved_amount -= sell_quantity
                        reserved_tire.save()

                        tire_obj = Tire.objects.get(id=reserved_tire.tire_id)
                        Transaction.objects.create(
                            tire_id=tire_obj,
                            transaction_type='Exit',
                            tire_amount=sell_quantity,
                            customer_name=customer_name,
                            contact_phone=contact_phone
                        )

                        if reserved_tire.reserved_amount == 0:
                            reserved_tire.delete()
                        return JsonResponse({'message': f'Reserved Tire sold {sell_quantity} units successfully'},
                                            status=status.HTTP_200_OK)
            except ReservedTire.DoesNotExist:
                return JsonResponse({'message': 'Reserved tire not found'}, status=status.HTTP_404_NOT_FOUND)

        else:
            try:
                tire = Tire.objects.get(id=tire_id)
                sell_quantity = int(request.data.get('sellQuantity'))

                if 0 < sell_quantity <= tire.stock:
                    tire.stock -= sell_quantity
                    tire.save()

                    Transaction.objects.create(
                        tire_id=tire,
                        transaction_type='Exit',
                        tire_amount=sell_quantity,
                        customer_name=customer_name,
                        contact_phone=contact_phone
                    )

                    return JsonResponse({'message': f' Tire sold {sell_quantity} units successfully'}, status=status.HTTP_200_OK)
                elif sell_quantity < 0:
                    return JsonResponse({'message': "Invalid amount. Sell quantity is below zero."}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return JsonResponse({'message': "Invalid amount. Sell quantity exceeds stock quantity."}, status=status.HTTP_400_BAD_REQUEST)

            except Tire.DoesNotExist:
                return JsonResponse({'message': 'Tire not found'}, status=status.HTTP_404_NOT_FOUND)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@csrf_exempt
@api_view(['POST'])
def add_tire_stock(request, tire_id):
    if request.method == 'POST':
        try:
            tire = Tire.objects.get(id=tire_id)
            stock_quantity = int(request.data.get('stockQuantity'))
            tire.stock += stock_quantity
            tire.save()
            return JsonResponse({'message': f'Tire stock quantity for id: {tire_id} increased by {stock_quantity} units successfully'}, status=status.HTTP_200_OK)
        except Tire.DoesNotExist:
            return JsonResponse({'message': 'Tire not found'}, status=status.HTTP_404_NOT_FOUND)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
