from django.views.decorators.csrf import csrf_exempt
from django.utils.translation import gettext_lazy as _
from cardle.forms import CarSearchForm
from django.http import JsonResponse
from django.http import HttpResponse
from django.shortcuts import render
from django.utils import timezone
from guessing.models import Car, GuessCount
from django.db.models import Q
from datetime import timedelta
from datetime import datetime
from dal import autocomplete
from django.shortcuts import redirect
from django.conf import settings
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
        available_cars_today = Car.objects.exclude(model=yesterday_car_model)

        random.seed(seed_today)
        random_car_today = random.choice(available_cars_today)
        activate(request.session.get('language'))

        car_details = {
            'Model': random_car_today.model,
            'Brand': ', '.join(brand.name for brand in random_car_today.brand.all()),
            'Fuel': ', '.join(str(_(fuel.name)) for fuel in random_car_today.fuel.all()),
            'Car Type': ', '.join(str(_(car_type.name)) for car_type in random_car_today.car_type.all()),
            'Engine conf': ', '.join(str(_(engine_conf.name)) for engine_conf in random_car_today.engine_conf.all()),
            'Drive wheel': ', '.join(str(_(drive_wheel.name)) for drive_wheel in random_car_today.drive_wheel.all()),
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

    if len(search_term) >= 3:
        contains_suggestions = Car.objects.filter(model__icontains=search_term).exclude(model__in=guessed_today).values_list('model', flat=True)
    else :
        contains_suggestions = Car.objects.filter(Q(model__icontains=' ' + search_term) | Q(model__istartswith=search_term)).exclude(model__in=guessed_today).values_list('model', flat=True)
    suggestions = sorted(set(startswith_suggestions) | set(contains_suggestions))

    def word_order_key(model_name):
        return [word.lower() for word in model_name.split()]

    suggestions.sort(key=word_order_key)

    return JsonResponse({'suggestions': suggestions})

def home(request):
    form = CarSearchForm(request.GET or None)

    current_date = datetime.now().date()
    stored_date_str = request.session.get('today_date', None)
    language = request.session.get('language')

    if not language:
        request.session['language'] = 'en'

    if stored_date_str and stored_date_str != str(current_date):
        request.session['guessed_today'] = []
        request.session['guess_count'] = 0
    request.session['today_date'] = str(current_date)

    activate(request.session.get('language'))
    guess_message = _("Guess today's car !")
    guess_button = _("Guess")
    search = _("Search for a car model")
    next_car = _("Next car in:")

    available_languages = [
        {'code': lang_code, 'name': lang_name}
        for lang_code, lang_name in settings.LANGUAGES
    ]

    return render(request, 'guessing/home.html', {'form': form, 'guess_msg' : guess_message, 'guess' : guess_button, 'search' : search, 'next_car' : next_car, 'available_languages': available_languages,})

from django.utils.translation import activate
    
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
            activate(request.session.get('language'))
            car_details = {
                'Model': car.model,
                'Brand': ', '.join(brand.name for brand in car.brand.all()),
                'Fuel': ', '.join(str(_(fuel.name)) for fuel in car.fuel.all()),
                'Car Type': ', '.join(str(_(car_type.name)) for car_type in car.car_type.all()),
                'Engine conf': ', '.join(str(_(engine_conf.name)) for engine_conf in car.engine_conf.all()),
                'Drive wheel': ', '.join(str(_(drive_wheel.name)) for drive_wheel in car.drive_wheel.all()),
                'Year': car.year,
                'Picture': get_base64_image(car.picture) if car.picture else None,
            } 
            return JsonResponse({'car_details': car_details})
        except Car.DoesNotExist:
            pass
    return JsonResponse({'car_details': 'No details found'})

def get_car_details_by_model(request, car_model):
    try:
        car = Car.objects.get(model__iexact=car_model)
        guessed_today = []
        if car_model in guessed_today:
            return {'error': 'Car already guessed today'}
        activate(request.session.get('language'))
        guessed_today.append(car_model)
        car_details = {
            'Model': car.model,
            'Brand': ', '.join(brand.name for brand in car.brand.all()),
            'Fuel': ', '.join(str(_(fuel.name)) for fuel in car.fuel.all()),
            'Car Type': ', '.join(str(_(car_type.name)) for car_type in car.car_type.all()),
            'Engine conf': ', '.join(str(_(engine_conf.name)) for engine_conf in car.engine_conf.all()),
            'Drive wheel': ', '.join(str(_(drive_wheel.name)) for drive_wheel in car.drive_wheel.all()),
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
        car_details = get_car_details_by_model(request, car_model)
        guessed_cars_details.append(car_details.get('car_details', {}))

    return JsonResponse({'guessed_cars_details': guessed_cars_details})

def increment_win_streak(request):
    win_streak = request.session.get('win_streak', 0)
    win_streak += 1
    request.session['win_streak'] = win_streak
    request.session['last_guess_date'] = current_date = str(datetime.now().date())
    return JsonResponse({'win_streak': win_streak})

def get_win_streak(request):
    last_guess_date = request.session.get('last_guess_date')  
    if last_guess_date != str(timezone.now().date() - timedelta(days=1)) and last_guess_date != str(datetime.now().date()):
        request.session['win_streak'] = 0
    win_streak = request.session.get('win_streak')
    return JsonResponse({'win_streak': win_streak})

def set_language(request):
    lang_code = request.GET.get('language')
    if lang_code and lang_code in [code for code, _ in settings.LANGUAGES]:
        request.session['language'] = lang_code
    return redirect(request.META.get('guessing/home.html', '/'))

def get_live_count(request):
    guess_count = GuessCount.objects.first()
    if guess_count is None:
        guess_count = GuessCount.objects.create(count=0)
    return JsonResponse({'count': guess_count.count})

def ordinal(n):
    suffix = ['th', 'st', 'nd', 'rd'] + ['th'] * 6
    if 10 <= n % 100 <= 20:
        return f"{n}th"
    return f"{n}{suffix[n % 10]}"

def get_user_count(request):
    guesses = request.session.get('guess_count')
    print(guesses)
    return JsonResponse({'count': ordinal(guesses)})

def increment_count(request):
    if request.method == 'POST':
        guess_count = GuessCount.objects.first()
        if guess_count is None:
            guess_count = GuessCount.objects.create(count=1)
        else:
            guess_count.count += 1
            guess_count.save()
        request.session['guess_count'] = guess_count.count
        print(guess_count)
        return JsonResponse({'success': True, 'count': guess_count.count})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method.'})