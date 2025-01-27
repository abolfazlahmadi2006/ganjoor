from django.contrib import admin
from .models import Person, Producer, SewingHouseWorker, CutHouseWorker, Cut, Roll

admin.site.register(Person)
admin.site.register(Producer)
admin.site.register(SewingHouseWorker)
admin.site.register(CutHouseWorker)
admin.site.register(Cut)
admin.site.register(Roll)
