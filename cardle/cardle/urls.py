from django.conf.urls.i18n import i18n_patterns
from guessing.views import increment_win_streak
from guessing.views import get_guessed_cars
from guessing.views import car_suggestions
from guessing.views import set_language
from django.conf.urls.static import static
from guessing.views import get_random_car
from guessing.views import get_win_streak
from django.urls import path, include 
from django.conf import settings 
from django.contrib import admin
from django.urls import path
from guessing import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('car-suggestions/', car_suggestions, name='car-suggestions'),
    path('get_random_car/', get_random_car, name='get_random_car'),
    path('get_guessed_cars/', get_guessed_cars, name='get_guessed_cars'),
    path('increment_win_streak/', increment_win_streak, name='increment_win_streak'),
    path('get_win_streak/', get_win_streak, name='get_win_streak'),
    path('', views.home, name='home'),
    path('get_car_details/', views.get_car_details, name='get_car_details'),
    path('set_language/', set_language, name='set_language'),
    path('get_live_count/', views.get_live_count, name='get_live_count'),
    path('increment_count/', views.increment_count, name='increment_count'),
    path('get_user_count/', views.get_user_count, name='get_user_count'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)