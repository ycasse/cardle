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
from datetime import datetime
import random
import base64
import re

@csrf_exempt
def get_random_car(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        seed_today = timezone.now().date().day
        yesterday = timezone.now() - timedelta(days=1)
        seed_yesterday = yesterday.day
        random.seed(seed_yesterday)
        car_selected_yesterday = random.choice(Car.objects.all())
        yesterday_car_model = car_selected_yesterday.model

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

    guessed_today = request.session.get('guessed_today', [])

    startswith_suggestions = Car.objects.filter(model__istartswith=search_term).exclude(model__in=guessed_today).values_list('model', flat=True)

    contains_suggestions = Car.objects.filter(Q(model__icontains=' ' + search_term) | Q(model__istartswith=search_term)).exclude(model__in=guessed_today).values_list('model', flat=True)

    suggestions = sorted(set(startswith_suggestions) | set(contains_suggestions))

    def word_order_key(model_name):
        return [word.lower() for word in model_name.split()]

    suggestions.sort(key=word_order_key)

    return JsonResponse({'suggestions': suggestions})

def home(request):
    form = CarSearchForm(request.GET or None)

    current_date = datetime.now().date()
    stored_date_str = request.session.get('guessed_today_date', None)

    if stored_date_str and stored_date_str != str(current_date):
        request.session['guessed_today'] = []
        request.session['guessed_today_date'] = str(current_date)

    return render(request, 'guessing/home.html', {'form': form})

    
def get_car_details(request):
    car_model = request.GET.get('car_model', None)
    if car_model:
        try:
            car = Car.objects.get(model__iexact=car_model)
            guessed_today = request.session.get('guessed_today', [])
            if car_model in guessed_today:
                return JsonResponse({'error': 'Car already guessed today'}, status=400)

            guessed_today.append(car_model)
            request.session['guessed_today'] = guessed_today

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

def get_car_details_by_model(car_model):
    try:
        car = Car.objects.get(model__iexact=car_model)
        guessed_today = []  # Modify this line to retrieve the guessed_today list from wherever it is stored
        if car_model in guessed_today:
            return {'error': 'Car already guessed today'}

        guessed_today.append(car_model)
        # Modify this line to update the guessed_today list wherever it is stored
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
        return {'car_details': car_details}
    except Car.DoesNotExist:
        return {'car_details': 'No details found'}

def get_base64_image(image_field):
    with open(image_field.path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    return f"data:image/png;base64,{encoded_string}"
    
def get_guessed_cars(request):
    guessed_cars = request.session.get('guessed_today', [])
    guessed_cars_details = []

    for car_model in guessed_cars:
        car_details = get_car_details_by_model(car_model)
        guessed_cars_details.append(car_details.get('car_details', {}))

    return JsonResponse({'guessed_cars_details': guessed_cars_details})