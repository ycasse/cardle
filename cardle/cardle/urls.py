"""
URL configuration for cardle project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from guessing import views
from guessing.views import car_suggestions
from guessing.views import get_random_car
from guessing.views import get_guessed_cars
from django.conf import settings 
from django.urls import path, include 
from django.conf.urls.static import static 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('car-suggestions/', car_suggestions, name='car-suggestions'),
    path('get_car_details/', views.get_car_details, name='get_car_details'),
    path('get_random_car/', get_random_car, name='get_random_car'),
    path('get_guessed_cars/', get_guessed_cars, name='get_guessed_cars'),
    
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 