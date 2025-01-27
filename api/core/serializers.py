from rest_framework import serializers
from .models import Cut, Roll, Producer

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
        fields = '__all__'
        extra_fields = ['number_of_rolls']

    def get_number_of_rolls(self, obj):
        return obj.rolls.count()

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
        print(f"validated_data:{validated_data}")
        rolls_data = validated_data.pop('rolls', [])
        cut = Cut.objects.create(**validated_data)
        for roll_data in rolls_data:
            Roll.objects.create(cut=cut, **roll_data)
        return cut

class CutListSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField()
    number_of_rolls = serializers.SerializerMethodField()

    class Meta:
        model = Cut
        fields = ['cut_code', 'create_date', 'model_name', 'owner', 'number_of_rolls']

    def get_number_of_rolls(self, obj):
        return obj.rolls.count()

class ProducerSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField()
    class Meta:
        model = Producer
        fields = ('name', 'person', 'brand_name')
