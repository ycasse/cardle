from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils import timezone

class Brand(models.Model):
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=5, default='🏁')

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
    year = models.fields.IntegerField(validators=[MinValueValidator(1900), MaxValueValidator(2024)])
    picture = models.ImageField(upload_to='car_pics', blank=True, null=True)
    
    def __str__(self):
        return self.model

class GuessCount(models.Model):
    count = models.IntegerField(default=0)
    last_reset = models.DateTimeField(default=timezone.now)

    @classmethod
    def get_count(cls):
        # Fetch the count from the database
        return cls.objects.first().count

    @classmethod
    def increment_count(cls):
        # Increment the count in the database
        count_obj = cls.objects.first()
        count_obj.count += 1
        count_obj.save()

    @classmethod
    def reset_count(cls):
        # Reset the count to 0 at midnight
        cls.objects.update(count=0, last_reset=timezone.now)