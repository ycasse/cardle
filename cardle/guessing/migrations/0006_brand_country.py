# Generated by Django 5.0 on 2024-02-16 17:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('guessing', '0005_alter_car_year'),
    ]

    operations = [
        migrations.AddField(
            model_name='brand',
            name='country',
            field=models.CharField(default='🏁', max_length=5),
        ),
    ]