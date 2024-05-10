# Generated by Django 5.0.4 on 2024-05-10 10:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_tire_reserved_amount'),
    ]

    operations = [
        migrations.CreateModel(
            name='ReservedTire',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reserved_amount', models.IntegerField()),
                ('customer_name', models.CharField(max_length=255)),
                ('contact_phone', models.CharField(max_length=255)),
                ('tire', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reservedTire', to='api.tire')),
            ],
        ),
    ]
