from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

class Brand(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Fuel(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Car_type(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Engine_conf(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Drive_wheel(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Car(models.Model):
    model = models.fields.CharField(max_length=200)
    brand =models.ManyToManyField(Brand)
    fuel =models.ManyToManyField(Fuel)
    car_type = models.ManyToManyField(Car_type)
    engine_conf = models.ManyToManyField(Engine_conf)
    drive_wheel = models.ManyToManyField(Drive_wheel)
    year = models.fields.IntegerField(validators=[MinValueValidator(1900), MaxValueValidator(2023)])
    picture = models.ImageField(upload_to='car_pics', blank=True, null=True)
    
    def __str__(self):
        return self.model

