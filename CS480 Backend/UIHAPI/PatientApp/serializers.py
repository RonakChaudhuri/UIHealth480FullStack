from rest_framework import serializers
from .models import TimeSlot, Vaccine, Nurse, Patient, VaccineDelivery, NurseScheduling, VaccinationSchedule, VaccinationRecord

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = '__all__'

class VaccineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vaccine
        fields = '__all__'

class NurseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nurse
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class VaccineDeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = VaccineDelivery
        fields = '__all__'

class NurseSchedulingSerializer(serializers.ModelSerializer):
    class Meta:
        model = NurseScheduling
        fields = '__all__'

class VaccinationScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = VaccinationSchedule
        fields = '__all__'

class VaccinationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = VaccinationRecord
        fields = '__all__'
