# Generated by Django 5.1.1 on 2025-01-29 14:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_alter_cut_length_of_layers'),
    ]

    operations = [
        migrations.AddField(
            model_name='cut',
            name='create_date_gregorian',
            field=models.DateField(blank=True, null=True),
        ),
    ]
