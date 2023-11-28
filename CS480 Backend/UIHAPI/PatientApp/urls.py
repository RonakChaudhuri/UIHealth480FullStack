from django.urls import path
from .views import (
    TimeSlotAPI, VaccineAPI, NurseAPI, PatientAPI,
    VaccineDeliveryAPI, NurseSchedulingAPI, VaccinationScheduleAPI, VaccinationRecordAPI,
    TimeSlotRetrieveUpdateDestroyAPI, VaccineRetrieveUpdateDestroyAPI,
    NurseRetrieveUpdateDestroyAPI, PatientRetrieveUpdateDestroyAPI,
    VaccineDeliveryRetrieveUpdateDestroyAPI, NurseSchedulingRetrieveUpdateDestroyAPI,
    VaccinationScheduleRetrieveUpdateDestroyAPI, VaccinationRecordRetrieveUpdateDestroyAPI,
)

urlpatterns = [
    # ListCreateAPIView URLs
    path('timeslots/', TimeSlotAPI.as_view(), name='timeslot-list'),
    path('vaccines/', VaccineAPI.as_view(), name='vaccine-list'),
    path('nurses/', NurseAPI.as_view(), name='nurse-list'),
    path('patients/', PatientAPI.as_view(), name='patient-list'),
    path('vaccinedeliveries/', VaccineDeliveryAPI.as_view(), name='vaccinedelivery-list'),
    path('nurseschedulings/', NurseSchedulingAPI.as_view(), name='nursescheduling-list'),
    path('vaccinationschedules/', VaccinationScheduleAPI.as_view(), name='vaccinationschedule-list'),
    path('vaccinationrecords/', VaccinationRecordAPI.as_view(), name='vaccinationrecord-list'),

    # RetrieveUpdateDestroyAPIView URLs
    path('timeslots/<int:pk>/', TimeSlotRetrieveUpdateDestroyAPI.as_view(), name='timeslot-detail'),
    path('vaccines/<int:pk>/', VaccineRetrieveUpdateDestroyAPI.as_view(), name='vaccine-detail'),
    path('nurses/<int:pk>/', NurseRetrieveUpdateDestroyAPI.as_view(), name='nurse-detail'),
    path('patients/<int:pk>/', PatientRetrieveUpdateDestroyAPI.as_view(), name='patient-detail'),
    path('vaccinedeliveries/<int:pk>/', VaccineDeliveryRetrieveUpdateDestroyAPI.as_view(), name='vaccinedelivery-detail'),
    path('nurseschedulings/<int:pk>/', NurseSchedulingRetrieveUpdateDestroyAPI.as_view(), name='nursescheduling-detail'),
    path('vaccinationschedules/<int:pk>/', VaccinationScheduleRetrieveUpdateDestroyAPI.as_view(), name='vaccinationschedule-detail'),
    path('vaccinationrecords/<int:pk>/', VaccinationRecordRetrieveUpdateDestroyAPI.as_view(), name='vaccinationrecord-detail'),
]
