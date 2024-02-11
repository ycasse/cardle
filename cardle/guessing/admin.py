from django.contrib import admin
from guessing.models import Brand
from guessing.models import Car
from guessing.models import Fuel
from guessing.models import Car_type
from guessing.models import Engine_conf
from guessing.models import Drive_wheel

admin.site.register(Brand)
admin.site.register(Car)
admin.site.register(Fuel)
admin.site.register(Car_type)
admin.site.register(Engine_conf)
admin.site.register(Drive_wheel)
