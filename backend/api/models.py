from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


# Create your models here.
class Tire(models.Model):
    brand = models.CharField(max_length=50, null=True, blank=True)
    pattern = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"{self.brand} {self.pattern}"

    # def reserve_stock(self, quantity_to_reserve):
    #     if quantity_to_reserve < 0:
    #         raise ValueError("Quantity to reserve must be a non-negative integer")

    #     if self.stock is not None and self.stock >= quantity_to_reserve:
    #         self.stock -= quantity_to_reserve
    #         self.save()
    #     else:
    #         raise ValueError("Not enough stock available to reserve")

    def save(self, *args, **kwargs):
        created = not self.pk
        super(Tire, self).save(*args, **kwargs)

        # Transaction.objects.create(
        #     tire_id=self,
        #     transaction_type='Entry',
        #     tire_amount=self.stock,
        #     transaction_datetime=timezone.now()
        # )

    class Meta:
        verbose_name_plural = "tires"

class Transaction(models.Model):
    tire_id = models.ForeignKey(
        Tire,
        on_delete=models.CASCADE,
        db_column='tire_id'
    )
    transaction_type = models.CharField(max_length=50)
    tire_amount = models.PositiveIntegerField(blank=True, null=True)
    transaction_datetime = models.DateTimeField(auto_now_add=True)
    customer_name = models.CharField(max_length=255, blank=True, null=True)
    contact_phone = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.transaction_type} of {self.tire_amount} tires on {self.transaction_datetime}"

    class Meta:
        verbose_name_plural = "transactions"

# class ReservedTire(models.Model):
#     tire = models.ForeignKey(Tire, on_delete=models.CASCADE, related_name="reservedTire")
#     reserved_amount = models.IntegerField()
#     customer_name = models.CharField(max_length=255)
#     contact_phone = models.CharField(max_length=255)

#     def __str__(self):
#         return f"Reserved Tire ID: {self.tire.id} - Reserved Amount: {self.reserved_amount}"
    
# class HotelTire(models.Model):
#     brand = models.CharField(max_length=50, null=True, blank=True)
#     pattern = models.CharField(max_length=50, null=True, blank=True)
#     customer_name = models.CharField(max_length=255)
#     contact_phone = models.CharField(max_length=50)
#     amount = models.PositiveIntegerField(default=0)
#     location = models.CharField(max_length=50, null=True, blank=True)

#     def __str__(self):
#         return f"""
#             Hotel Tire ID: {self.id}
#             Brand: {self.brand}
#             Pattern: {self.pattern}
#             Customer: {self.customer_name}
#             Contact Phone: {self.contact_phone}
#             Amount: {self.amount}
#             Location: {self.location}
#         """