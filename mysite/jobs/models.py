from django.db import models 
from django.core import serializers
from django.contrib.auth.models import User
# Create your models here.

class Company(models.Model):
	company_name = models.CharField()
	industry = models.Charfield()
	company_size = models.IntergerField()
	




class Jobs(models.Model):
	company = models.ForeignKey(Company)
	department = models.CharField()
	applicants = models.ForeignKey(User)
	title = models.CharField()
	job_description = models.TextField()
	date_posted = models.DateField()
	date_ending = models.DateField()
	salary_range = models.CharField()




