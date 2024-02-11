
from django import forms
from dal import autocomplete
from guessing.models import Car

class CarSearchForm(forms.ModelForm):
    class Meta:
        model = Car
        fields = ['model']
        widgets = {
            'model': autocomplete.Select2(
                url='car-autocomplete'
            )
        }