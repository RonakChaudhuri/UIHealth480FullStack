from rest_framework import generics
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse

from PatientApp.models import TimeSlot, Vaccine, Nurse, Patient, VaccineDelivery, NurseScheduling, VaccinationSchedule, VaccinationRecord
from PatientApp.serializers import TimeSlotSerializer, VaccineSerializer, NurseSerializer, PatientSerializer, VaccineDeliverySerializer, NurseSchedulingSerializer, VaccinationScheduleSerializer, VaccinationRecordSerializer

# ListCreateAPIView for listing and creating instances
class TimeSlotAPI(generics.ListCreateAPIView):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer

class VaccineAPI(generics.ListCreateAPIView):
    queryset = Vaccine.objects.all()
    serializer_class = VaccineSerializer

class NurseAPI(generics.ListCreateAPIView):
    queryset = Nurse.objects.all()
    serializer_class = NurseSerializer

class PatientAPI(generics.ListCreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class VaccineDeliveryAPI(generics.ListCreateAPIView):
    queryset = VaccineDelivery.objects.all()
    serializer_class = VaccineDeliverySerializer

class NurseSchedulingAPI(generics.ListCreateAPIView):
    queryset = NurseScheduling.objects.all()
    serializer_class = NurseSchedulingSerializer

class VaccinationScheduleAPI(generics.ListCreateAPIView):
    queryset = VaccinationSchedule.objects.all()
    serializer_class = VaccinationScheduleSerializer

class VaccinationRecordAPI(generics.ListCreateAPIView):
    queryset = VaccinationRecord.objects.all()
    serializer_class = VaccinationRecordSerializer

# RetrieveUpdateDestroyAPIView for retrieving, updating, and deleting instances
class TimeSlotRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer

class VaccineRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vaccine.objects.all()
    serializer_class = VaccineSerializer

class NurseRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Nurse.objects.all()
    serializer_class = NurseSerializer

class PatientRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class VaccineDeliveryRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = VaccineDelivery.objects.all()
    serializer_class = VaccineDeliverySerializer

class NurseSchedulingRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = NurseScheduling.objects.all()
    serializer_class = NurseSchedulingSerializer

class VaccinationScheduleRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = VaccinationSchedule.objects.all()
    serializer_class = VaccinationScheduleSerializer

class VaccinationRecordRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = VaccinationRecord.objects.all()
    serializer_class = VaccinationRecordSerializer
