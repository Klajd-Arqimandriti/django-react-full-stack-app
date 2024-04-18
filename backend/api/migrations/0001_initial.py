# Generated by Django 5.0.4 on 2024-04-17 09:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Tire',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rim', models.CharField(blank=True, max_length=20, null=True)),
                ('code', models.PositiveIntegerField(blank=True, null=True)),
                ('brand', models.CharField(blank=True, max_length=50, null=True)),
                ('pattern', models.CharField(blank=True, max_length=50, null=True)),
                ('tire_size', models.CharField(blank=True, max_length=50, null=True)),
                ('tire_size_1', models.CharField(blank=True, max_length=50, null=True)),
                ('season', models.CharField(blank=True, max_length=20, null=True)),
                ('car_type', models.CharField(blank=True, max_length=50, null=True)),
                ('position', models.CharField(blank=True, max_length=50, null=True)),
                ('stock', models.PositiveIntegerField(default=0)),
                ('min_stock', models.PositiveIntegerField(default=0)),
                ('price', models.DecimalField(blank=True, decimal_places=5, max_digits=10, null=True)),
                ('width', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('ratio', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('speed_index', models.CharField(blank=True, max_length=5, null=True)),
                ('location', models.CharField(blank=True, max_length=50, null=True)),
                ('reserved_amount', models.PositiveIntegerField(default=0)),
                ('manufacturing_date', models.DateField(blank=True, null=True)),
                ('origin', models.CharField(blank=True, max_length=50, null=True)),
                ('zip_code', models.CharField(blank=True, max_length=10, null=True)),
                ('country', models.CharField(blank=True, max_length=50, null=True)),
            ],
            options={
                'verbose_name_plural': 'tires',
            },
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('transaction_type', models.CharField(max_length=50)),
                ('tire_amount', models.PositiveIntegerField(blank=True, null=True)),
                ('transaction_datetime', models.DateTimeField(auto_now_add=True)),
                ('customer_name', models.CharField(blank=True, max_length=255, null=True)),
                ('contact_phone', models.CharField(blank=True, max_length=255, null=True)),
                ('tire_id', models.ForeignKey(db_column='tire_id', on_delete=django.db.models.deletion.CASCADE, to='api.tire')),
            ],
            options={
                'verbose_name_plural': 'transactions',
            },
        ),
    ]
