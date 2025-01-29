from django.db import models

from queryable_properties.properties import queryable_property



class Person(models.Model):
    PERSON_TYPES = [
        ('producer', 'Producer'),
        ('sewing_worker', 'Sewing House Worker'),
        ('cut_worker', 'Cut House Worker'),
    ]
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    person_type = models.CharField(max_length=15, choices=PERSON_TYPES)

    def __str__(self) -> str:
        return self.name
    
class Producer(models.Model):
    person = models.OneToOneField(Person, on_delete=models.CASCADE, primary_key=True)
    brand_name = models.CharField(max_length=100)

    def __str__(self) -> str:
        return self.person.name
    
    @property
    def name(self):
        return self.person.name


class SewingHouseWorker(models.Model):
    person = models.OneToOneField(Person, on_delete=models.CASCADE, primary_key=True)
    payment_card_number = models.CharField(max_length=16)

    def __str__(self) -> str:
        return self.person.name

class CutHouseWorker(models.Model):
    person = models.OneToOneField(Person, on_delete=models.CASCADE, primary_key=True)
    payment_card_number = models.CharField(max_length=16)

    def __str__(self) -> str:
        return self.person.name


class Sizes(models.TextChoices):
    FREE = '1', 'Free'
    TWO = '2', '2'
    THREE = '3', '3'
    FOUR = '4', '4'

class Cut(models.Model): 
    cut_code = models.CharField(max_length=100, primary_key=True)
    create_date = models.CharField(max_length=10, blank=True, null=True)
    create_date_gregorian = models.DateField(blank=True, null=True)
    owner = models.ForeignKey(Producer, on_delete=models.CASCADE, blank=True, null=True)
    sewer = models.ForeignKey('SewingHouseWorker', on_delete=models.SET_NULL, null=True, related_name='cuts', blank=True)
    model_name = models.CharField(max_length=100, blank=True, null=True)
    model_code = models.CharField(max_length=100, blank=True, null=True)
    lai_per_unit = models.PositiveSmallIntegerField(blank=True, null=True)
    product_per_layer = models.PositiveSmallIntegerField(blank=True, null=True)
    size = models.CharField(max_length=1, choices=Sizes.choices, default=Sizes.FREE, blank=True, null=True)
    length_of_layers = models.FloatField(blank=True, null=True)
    cutting_price = models.PositiveSmallIntegerField(blank=True, null=True)
    sewing_price = models.PositiveSmallIntegerField(blank=True, null=True)
    cutting_price_raw = models.PositiveSmallIntegerField(blank=True, null=True)
    sewing_price_raw = models.PositiveSmallIntegerField(blank=True, null=True)

    def __str__(self) -> str:
        return self.cut_code
    
    def total_product(self):
        number = 0
        rolls = Roll.objects.filter(cut=self.cut_code)
        for roll in rolls:
            number += roll.products
        return number
    
    def roll_set(self):
        return Roll.objects.filter(cut=self.cut_code)
    
    def cut_margin(self):
        cm = (self.cutting_price_raw - self.cutting_price) * self.total_product
        return cm
    
    def sew_margin(self):
        sm = (self.sewing_price_raw - self.sewing_price) * self.total_product
        return sm
    
    def total_margin(self):
        return self.cut_margin + self.sew_margin
    
    class Mete:
        ordering = ['create_date_gregorian']

    
class Roll(models.Model):
    cut = models.ForeignKey(Cut, related_name='rolls', on_delete=models.CASCADE, null=True)
    color = models.CharField(max_length=50, null=True)
    length = models.FloatField(null=True)
    layers = models.FloatField(null=True)
    products = models.PositiveSmallIntegerField(null=True)
    type_fabric = models.CharField(max_length=128, blank=True, null=True)
    description = models.CharField(max_length=128, blank=True, null=True)


    def __str__(self) -> str:
        return f'{self.color} - {self.length} - {self.cut.cut_code}'


