from rest_framework import serializers
from .models import Cut, Roll, Producer
from jdatetime import datetime as jdatetime
from datetime import datetime

class RollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roll
        fields = '__all__'

class CutDetailSerializer(serializers.ModelSerializer):
    rolls = RollSerializer(many=True)
    owner = serializers.StringRelatedField()
    number_of_rolls = serializers.SerializerMethodField()

    class Meta:
        model = Cut
        fields = [
            "cut_code",
            "create_date",
            "create_date_gregorian",
            "owner",
            "sewer",
            "model_name",
            "model_code",
            "lai_per_unit",
            "product_per_layer",
            "size",
            "length_of_layers",
            "cutting_price",
            "sewing_price",
            "cutting_price_raw",
            "sewing_price_raw",
            "total_product",
            # "roll_set",
            "cut_margin",
            "sew_margin",
            "total_margin",
            "rolls",
            "number_of_rolls",
            "owner_name"
        ]
        extra_fields = ['number_of_rolls']

    def get_number_of_rolls(self, obj):
        return obj.rolls.count()
    
class CutUpdateSerializer(serializers.ModelSerializer):
    rolls = RollSerializer(many=True)
    owner = serializers.PrimaryKeyRelatedField(queryset=Producer.objects.all())
    number_of_rolls = serializers.SerializerMethodField()

    class Meta:
        model = Cut
        fields = '__all__'
        extra_fields = ['number_of_rolls']

    def get_number_of_rolls(self, obj):
        return obj.rolls.count()

    def update(self, instance, validated_data):
        # Convert Jalali date to Gregorian
        create_date = validated_data.get('create_date')
        if create_date:
            try:
                j_date = jdatetime.strptime(create_date, '%Y-%m-%d')
                validated_data['create_date_gregorian'] = j_date.togregorian().date()
            except ValueError:
                validated_data['create_date_gregorian'] = None

        # Extract rolls data separately
        rolls_data = validated_data.pop('rolls', [])

        # Update Cut instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # **Handle rolls properly**
        existing_roll_ids = [roll.id for roll in instance.rolls.all()]
        new_roll_ids = []

        for roll_data in rolls_data:
            roll_id = roll_data.get('id')

            if roll_id and roll_id in existing_roll_ids:
                # Update existing roll
                roll = Roll.objects.get(id=roll_id, cut=instance)
                for attr, value in roll_data.items():
                    setattr(roll, attr, value)
                roll.save()
                new_roll_ids.append(roll_id)
            else:
                # Create new roll
                roll_data.pop('cut', None)  # Ensure no conflict with cut foreign key
                new_roll = Roll.objects.create(cut=instance, **roll_data)
                new_roll_ids.append(new_roll.id)

        # **Delete removed rolls** (rolls that are no longer in the request)
        Roll.objects.filter(cut=instance).exclude(id__in=new_roll_ids).delete()

        return instance


class CutSerializer(serializers.ModelSerializer):   
    rolls = RollSerializer(many=True)
    owner = serializers.PrimaryKeyRelatedField(queryset=Producer.objects.all())
    number_of_rolls = serializers.SerializerMethodField()

    class Meta:
        model = Cut
        fields = '__all__'
        extra_fields = ['number_of_rolls']

    def get_number_of_rolls(self, obj):
        return obj.rolls.count()

    def create(self, validated_data):
        create_date = validated_data.get('create_date')
        if create_date:
            try:
                j_date = jdatetime.strptime(create_date, '%Y-%m-%d')
                g_date = j_date.togregorian().date()
                validated_data['create_date_gregorian'] = g_date
            except:
                validated_data['create_date_gregorian'] = None
                
        rolls_data = validated_data.pop('rolls', [])
        cut = Cut.objects.create(**validated_data)
        for roll_data in rolls_data:
            Roll.objects.create(cut=cut, **roll_data)
        return cut

class CutListSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField()
    number_of_rolls = serializers.SerializerMethodField()
    create_date_gregorian = serializers.SerializerMethodField()

    class Meta:
        model = Cut
        fields = ['cut_code', 'create_date', 'model_name', 'owner', 'number_of_rolls', 'create_date_gregorian', "owner_name"
]

    def get_number_of_rolls(self, obj):
        return obj.rolls.count()
    
    def get_create_date_gregorian(self, obj):
        return obj.create_date_gregorian

class ProducerSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField()
    class Meta:
        model = Producer
        fields = ('name', 'person', 'brand_name', 'person_id')
