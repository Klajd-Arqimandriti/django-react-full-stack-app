# Generated by Django 5.0.4 on 2024-04-29 07:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_remove_tire_car_type_remove_tire_code_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='tire',
            name='car_type',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='tire',
            name='code',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='tire',
            name='country',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='tire',
            name='location',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='tire',
            name='manufacturing_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='tire',
            name='min_stock',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='tire',
            name='origin',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='tire',
            name='position',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='tire',
            name='price',
            field=models.DecimalField(blank=True, decimal_places=5, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='tire',
            name='ratio',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
        migrations.AddField(
            model_name='tire',
            name='reserved_amount',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='tire',
            name='rim',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='tire',
            name='season',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='tire',
            name='speed_index',
            field=models.CharField(blank=True, max_length=5, null=True),
        ),
        migrations.AddField(
            model_name='tire',
            name='stock',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='tire',
            name='tire_size',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='tire',
            name='tire_size_1',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='tire',
            name='width',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
        migrations.AddField(
            model_name='tire',
            name='zip_code',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]
