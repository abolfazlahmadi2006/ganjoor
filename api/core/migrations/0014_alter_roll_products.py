# Generated by Django 5.1.1 on 2025-01-31 21:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_cut_create_date_gregorian'),
    ]

    operations = [
        migrations.AlterField(
            model_name='roll',
            name='products',
            field=models.PositiveSmallIntegerField(default=0),
        ),
    ]
