from django.db import models 
from django.utils import timezone
from django.contrib.auth.models import User



class Profile(models.Model):
	student_name = models.CharField(default=None,max_length=150)
	is_active = models.BooleanField(default=True)
	created_by = models.ForeignKey(User, related_name="+", default=0)
	created_at = models.DateField(auto_now=True)
	updated_at = models.DateTimeField(auto_now=True)
	updated_by = models.ForeignKey(User, related_name="+", default=0)
	final_project = models.CharField(default=None, max_length=300)

	class Meta:
		ordering = ('-created_at',)


class Cohort(models.Model):
	cohort_name = models.CharField("Name", max_length=100, unique=True)
	members = models.ManyToManyField(Profile)
	teacher = models.ForeignKey(User, related_name="+", default=0)
	created_at = models.DateField(default=None)
	start_date = models.DateField(default=None)
	created_by = models.ForeignKey(User, related_name="+", default=0)
	is_active = models.BooleanField(default=True)
	graduation_date = models.DateField(default=None)

	class Meta:
		ordering = ('-start_date',)

# class Lesson(models.Model):
# 	cohort = models.ForeignKey(Cohort)
# 	lesson_name = models.CharField("Lesson Name", default=None, max_length=100)
# 	date = models.DateField(default=None)
	
# 	class Meta:
# 		ordering = ('-date',)

ATTENDANCE_TYPES =  (
	('present', 'Present'),
	('unexcused', 'Unexcused'),
	('excused', 'Excused'),
	('late', 'Late'),
)

class AttendanceRecord(models.Model):
	user = models.ForeignKey(Profile)
	status = models.CharField("", max_length=10, choices=ATTENDANCE_TYPES)
	date =models.DateField(default=None)
