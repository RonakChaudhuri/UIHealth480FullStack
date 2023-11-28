from django.db import models

# Create your models here.

class TimeSlot(models.Model):
    time_slot_id = models.AutoField(primary_key=True)
    start_time = models.DateTimeField(unique=True)
    end_time = models.DateTimeField(unique=True)

class Vaccine(models.Model):
    vaccine_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    doses_required = models.PositiveIntegerField()
    description = models.TextField(blank=True)
    quantity_in_repository = models.PositiveIntegerField(default=0)

class Nurse(models.Model):
    nurse_id = models.AutoField(primary_key=True)
    fname = models.CharField(max_length=30)
    mi = models.CharField(max_length=1)
    lname = models.CharField(max_length=30)
    employee_id = models.CharField(max_length=20, unique=True)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10)
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    username = models.CharField(max_length=30, unique=True)
    password = models.CharField(max_length=30)
    schedule = models.ManyToManyField(TimeSlot, through='NurseScheduling')

class Patient(models.Model):
    patient_id = models.AutoField(primary_key=True)
    fname = models.CharField(max_length=30)
    mi = models.CharField(max_length=1)
    lname = models.CharField(max_length=30)
    ssn = models.CharField(max_length=20, unique=True)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10)
    race = models.CharField(max_length=30)
    occupation_class = models.CharField(max_length=50)
    medical_history = models.TextField()
    phone_number = models.CharField(max_length=15)
    address = models.TextField()
    username = models.CharField(max_length=30, unique=True)
    password = models.CharField(max_length=30)

class VaccineDelivery(models.Model):
    delivery_id = models.AutoField(primary_key=True)
    vaccine = models.ForeignKey(Vaccine, on_delete=models.CASCADE)
    quantity_delivered = models.PositiveIntegerField()
    delivery_date = models.DateField(auto_now_add=True)

class NurseScheduling(models.Model):
    scheduling_id = models.AutoField(primary_key=True)
    nurse = models.ForeignKey(Nurse, on_delete=models.CASCADE)
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE)

class VaccinationSchedule(models.Model):
    schedule_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    vaccine = models.ForeignKey(Vaccine, on_delete=models.CASCADE)
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE)
    dose_on_hold = models.PositiveIntegerField()

class VaccinationRecord(models.Model):
    record_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    nurse = models.ForeignKey(Nurse, on_delete=models.CASCADE)
    vaccine = models.ForeignKey(Vaccine, on_delete=models.CASCADE)
    dose_given = models.PositiveIntegerField()
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE)

