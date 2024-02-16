from django.shortcuts import render
from django.http import HttpResponse
from cardle.forms import CarSearchForm
from guessing.models import Car
from dal import autocomplete
from django.http import JsonResponse
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from datetime import timedelta
import random
import base64
import re

@csrf_exempt
def get_random_car(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        # Get today's random seed
        seed_today = timezone.now().date().day

        # Retrieve the car selected yesterday (using the seed from yesterday)
        yesterday = timezone.now() - timedelta(days=1)
        seed_yesterday = yesterday.day
        random.seed(seed_yesterday)
        car_selected_yesterday = random.choice(Car.objects.all())
        yesterday_car_model = car_selected_yesterday.model

        # Set the seed back to today's seed for the current random selection
        random.seed(seed_today)
        random_car_today = random.choice(Car.objects.all())

        car_details = {
            'Model': random_car_today.model,
            'Brand': ', '.join(brand.name for brand in random_car_today.brand.all()),
            'Fuel': ', '.join(fuel.name for fuel in random_car_today.fuel.all()),
            'Car Type': ', '.join(car_type.name for car_type in random_car_today.car_type.all()),
            'Engine conf': ', '.join(engine_conf.name for engine_conf in random_car_today.engine_conf.all()),
            'Drive wheel': ', '.join(drive_wheel.name for drive_wheel in random_car_today.drive_wheel.all()),
            'Year': random_car_today.year,
            'Picture': get_base64_image(random_car_today.picture) if random_car_today.picture else None,
            'Yesterday Car Model': yesterday_car_model,
        }

        return JsonResponse({'car_details': car_details})
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)

def car_suggestions(request):
    search_term = request.GET.get('search_term', '')

    sent_models = request.session.get('sent_models', [])

    startswith_suggestions = Car.objects.filter(model__istartswith=search_term).exclude(model__in=sent_models).values_list('model', flat=True)

    contains_suggestions = Car.objects.filter(Q(model__icontains=' ' + search_term) | Q(model__istartswith=search_term)).exclude(model__in=sent_models).values_list('model', flat=True)

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
