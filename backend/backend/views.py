from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models.fields import CharField, DecimalField, PositiveIntegerField, DateField
from django.db import models

from api.models import Tire


class FieldsAPIView(APIView):

    NUMBER_FIELDS = [DecimalField.__name__, PositiveIntegerField.__name__]
    TEXT_FIELDS = [CharField.__name__]
    DATE_FIELDS = [DateField.__name__]

    def get(self, request):
        """
        Get all fields from the Tire model
        """
        fields = []

        for field in Tire._meta.get_fields():
            if type(field) in [models.CharField, models.DecimalField, models.PositiveIntegerField, models.DateField]:
                fields.append({
                    'name': field.name,
                    'placeholder': field.verbose_name.title(),
                    'type':  FieldsAPIView.get_field_type(field)
                })

        return Response(fields)

    @staticmethod
    def get_field_type(field):
        if str(type(field).__name__) in FieldsAPIView.NUMBER_FIELDS:
            return 'number'
        if str(type(field).__name__) in FieldsAPIView.TEXT_FIELDS:
            return 'text'
        if str(type(field).__name__) in FieldsAPIView.DATE_FIELDS:
            return 'date'

        return 'null'