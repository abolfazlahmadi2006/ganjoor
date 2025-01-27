from django.shortcuts import render, redirect, get_object_or_404
from .forms import PersonForm, CutForm, RollFormSet, ProducerForm, ProducerForm, SewingHouseWorkerForm, CutHouseWorkerForm
from .models import Person, Cut

def cut_list(request):
    cuts = Cut.objects.all()
    return render(request, 'workhouse/cut_list.html', {'cuts': cuts})

def create_cut(request):
    if request.method == 'POST':
        cut_form = CutForm(request.POST)
        roll_formset = RollFormSet(request.POST)
        if cut_form.is_valid() and roll_formset.is_valid():
            cut = cut_form.save()
            rolls = roll_formset.save(commit=False)
            for roll in rolls:
                roll.cut = cut
                roll.save()
            return redirect('cut_list')
        
    else:
        cut_form = CutForm()
        roll_formset = RollFormSet()
    return render(request, 'workhouse/create_cut.html', {'cut_form': cut_form, 'roll_formset': roll_formset})

def cut_detail(request, cut_code):
    cut = get_object_or_404(Cut, cut_code=cut_code)
    rolls = cut.rolls.all()
    for roll in rolls:
        print(f"\n\n{roll}\n\n")
    return render(request, 'workhouse/cut_detail.html', {'cut': cut, 'rolls': rolls})

def person_list(request):
    persons = Person.objects.all()
    return render(request, 'workhouse/person_list.html', {'persons': persons})

def create_person(request):
    if request.method == 'POST':
        person_form = PersonForm(request.POST)
        if person_form.is_valid():
            person_type = person_form.cleaned_data['person_type']
            person = person_form.save(commit=False)

            if person_type == 'producer':
                producer_form = ProducerForm(request.POST)
                if producer_form.is_valid():
                    person.save()
                    producer = producer_form.save(commit=False)
                    producer.person = person
                    producer.save()
            elif person_type == 'sewing_worker':
                sewing_worker_form = SewingHouseWorkerForm(request.POST)
                if sewing_worker_form.is_valid():
                    person.save()
                    sewing_worker = sewing_worker_form.save(commit=False)
                    sewing_worker.person = person
                    sewing_worker.save()
            elif person_type == 'cut_worker':
                cut_worker_form = CutHouseWorkerForm(request.POST)
                if cut_worker_form.is_valid():
                    person.save()
                    cut_worker = cut_worker_form.save(commit=False)
                    cut_worker.person = person
                    cut_worker.save()
            return redirect('person_list')
    else:
        person_form = PersonForm()
        producer_form = ProducerForm()
        sewing_worker_form = SewingHouseWorkerForm()
        cut_worker_form = CutHouseWorkerForm()

    return render(request, 'workhouse/create_person.html', {
        'person_form': person_form,
        'producer_form': producer_form,
        'sewing_worker_form': sewing_worker_form,
        'cut_worker_form': cut_worker_form
    })


def person_detail(request, pk):
    person = get_object_or_404(Person, pk=pk)
    related_cuts = None
    if person.person_type == 'sewing_worker':
        related_cuts = Cut.objects.filter(sewer=person.sewinghouseworker)
    elif person.person_type == 'cut_worker':
        related_cuts = Cut.objects.filter(sewer=person.cuthouseworker)
    return render(request, 'workhouse/person_detail.html', {'person': person, 'related_cuts': related_cuts})



