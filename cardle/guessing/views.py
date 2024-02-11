from django.shortcuts import render
from django.http import HttpResponse
from cardle.forms import CarSearchForm
from guessing.models import Car
from dal import autocomplete
from django.http import JsonResponse
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import random
import base64
import re

@csrf_exempt
def get_random_car(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        seed = timezone.now().date().day
        random.seed(seed *2)

        random_car = random.choice(Car.objects.all())

        car_details = {
            'Model': random_car.model,
            'Brand': ', '.join(brand.name for brand in random_car.brand.all()),
            'Fuel': ', '.join(fuel.name for fuel in random_car.fuel.all()),
            'Car Type': ', '.join(car_type.name for car_type in random_car.car_type.all()),
            'Engine conf': ', '.join(engine_conf.name for engine_conf in random_car.engine_conf.all()),
            'Drive wheel': ', '.join(drive_wheel.name for drive_wheel in random_car.drive_wheel.all()),
            'Year': random_car.year,
            'Picture': get_base64_image(random_car.picture) if random_car.picture else None,
        }
        return JsonResponse({'car_details': car_details})
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)

def car_suggestions(request):
    search_term = request.GET.get('search_term', '')

    startswith_suggestions = Car.objects.filter(model__istartswith=search_term).values_list('model', flat=True)

    contains_suggestions = Car.objects.filter(Q(model__icontains=' ' + search_term) | Q(model__istartswith=search_term)).values_list('model', flat=True)

    suggestions = sorted(set(startswith_suggestions) | set(contains_suggestions))

    def word_order_key(model_name):
        return [word.lower() for word in model_name.split()]

    suggestions.sort(key=word_order_key)

    return JsonResponse({'suggestions': suggestions})

def home(request):
    form = CarSearchForm(request.GET or None)

    return render(request, 'guessing/home.html', {'form': form})

    
def get_car_details(request):
    car_model = request.GET.get('car_model', None)
    if car_model:
        try:
            car = Car.objects.get(model__iexact=car_model)
            car_details = {
                'Model': car.model,
                'Brand': ', '.join(brand.name for brand in car.brand.all()),
                'Fuel': ', '.join(fuel.name for fuel in car.fuel.all()),
                'Car Type': ', '.join(car_type.name for car_type in car.car_type.all()),
                'Engine conf': ', '.join(engine_conf.name for engine_conf in car.engine_conf.all()),
                'Drive wheel': ', '.join(drive_wheel.name for drive_wheel in car.drive_wheel.all()),
                'Year': car.year,
                'Picture': get_base64_image(car.picture) if car.picture else None,
            } 
            return JsonResponse({'car_details': car_details})
        except Car.DoesNotExist:
            pass
    return JsonResponse({'car_details': 'No details found'})

def get_base64_image(image_field):
    with open(image_field.path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    return f"data:image/png;base64,{encoded_string}"