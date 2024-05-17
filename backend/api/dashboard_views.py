from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import status
from .models import Transaction
from .serializers import TransactionSerializer
from datetime import datetime
import pytz


@csrf_exempt
@api_view(['GET'])
def get_entries(request, start_date, end_date):
    if request.method == 'GET':
        try:
            # Convert string dates to datetime objects and make them timezone-aware
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
            end_date = datetime.strptime(end_date, '%Y-%m-%d')

            # Adjust the end_date to include the entire day
            end_date = end_date.replace(hour=23, minute=59, second=59, microsecond=999999)

            # Make both dates timezone-aware (assuming your data is in UTC)
            utc = pytz.UTC
            start_date = utc.localize(start_date)
            end_date = utc.localize(end_date)

            # Filter transactions by type "Entry" and datetime range
            entry_transactions = Transaction.objects.filter(
                transaction_type='Entry',
                transaction_datetime__range=[start_date, end_date]
            )

            # Serialize the data
            serializer = TransactionSerializer(entry_transactions, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({'error': 'Invalid date format. Please use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(['GET'])
def get_sales(request, start_date, end_date):
    if request.method == 'GET':
        try:
            # Convert string dates to datetime objects and make them timezone-aware
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
            end_date = datetime.strptime(end_date, '%Y-%m-%d')

            # Adjust the end_date to include the entire day
            end_date = end_date.replace(hour=23, minute=59, second=59, microsecond=999999)

            # Make both dates timezone-aware (assuming your data is in UTC)
            utc = pytz.UTC
            start_date = utc.localize(start_date)
            end_date = utc.localize(end_date)

            # Filter transactions by type "Sale" and datetime range
            sale_transactions = Transaction.objects.filter(
                transaction_type='Exit',
                transaction_datetime__range=[start_date, end_date]
            )

            # Serialize the data
            serializer = TransactionSerializer(sale_transactions, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({'error': 'Invalid date format. Please use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(['GET'])
def get_reservations(request, start_date, end_date):
    if request.method == 'GET':
        try:
            # Convert string dates to datetime objects and make them timezone-aware
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
            end_date = datetime.strptime(end_date, '%Y-%m-%d')

            # Adjust the end_date to include the entire day
            end_date = end_date.replace(hour=23, minute=59, second=59, microsecond=999999)

            # Make both dates timezone-aware (assuming your data is in UTC)
            utc = pytz.UTC
            start_date = utc.localize(start_date)
            end_date = utc.localize(end_date)

            # Filter transactions by type "Reservation" and datetime range
            reservation_transactions = Transaction.objects.filter(
                transaction_type='Reservation',
                transaction_datetime__range=[start_date, end_date]
            )

            # Serialize the data
            serializer = TransactionSerializer(reservation_transactions, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({'error': 'Invalid date format. Please use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
