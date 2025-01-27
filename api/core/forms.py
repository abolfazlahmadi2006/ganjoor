from django import forms
from django.forms import inlineformset_factory
from .models import Cut, Roll, Producer, SewingHouseWorker, CutHouseWorker, Person

class CutForm(forms.ModelForm):
    class Meta:
        model = Cut
        fields = [
            'cut_code',
            'create_date',
            'owner',
            'sewer',
            'model_name',
            'model_code',
            'lai_per_unit',
            'product_per_layer',
            'size',
            'length_of_layers',
            'cutting_price',
            'sewing_price',
            'cutting_price_raw',
            'sewing_price_raw',
        ]

class RollForm(forms.ModelForm):
    class Meta:
        model = Roll
        fields = ['color', 'length', 'layers', 'products', 'type_fabric']
        
RollFormSet = inlineformset_factory(Cut, Roll, form=RollForm, extra=1, can_delete=True)

class PersonForm(forms.ModelForm):
    class Meta:
        model = Person
        fields = ['name', 'phone_number', 'person_type']

class ProducerForm(forms.ModelForm):
    class Meta:
        model = Producer
        fields = ['brand_name']

class SewingHouseWorkerForm(forms.ModelForm):
    class Meta:
        model = SewingHouseWorker
        fields = ['payment_card_number']

class CutHouseWorkerForm(forms.ModelForm):
    class Meta:
        model = CutHouseWorker
        fields = ['payment_card_number']

