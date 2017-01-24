from django.db import models 
from django.utils import timezone
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.core import serializers


class Profile(models.Model):
	user = models.OneToOneField(User, default=None)
	position = models.CharField(default=None,max_length=100)
	is_active = models.BooleanField(default=True)
	created_by = models.ForeignKey(User, related_name="+", default=0)
	created_at = models.DateField(auto_now=True)
	updated_at = models.DateTimeField(auto_now=True)
	updated_by = models.ForeignKey(User, related_name="+", default=0)
	final_project = models.CharField(default=None, max_length=300)

	class Meta:
		ordering = ('-created_at',)

	def as_json( self, *args, **kwargs):
		return self.__dict__

class Cohort(models.Model):
	cohort_name = models.CharField("Name", max_length=100, unique=True)
	members = models.ManyToManyField(User)
	teacher = models.ForeignKey(User, related_name="+", default=0)
	created_at = models.DateField(default=None)
	start_date = models.DateField(default=None)
	created_by = models.ForeignKey(User, related_name="+", default=0)
	is_active = models.BooleanField(default=True)
	graduation_date = models.DateField(default=None)
	slug = models.SlugField(max_length=200, default=None)

	class Meta:
		ordering = ('-start_date',)

	def save( self, *args, **kwargs):
		self.slug = slugify(self.cohort_name)
		return super( Cohort, self ).save( *args, **kwargs)

	def as_json( self, *args, **kwargs):
		return self.__dict__

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
	user = models.ForeignKey(User)
	status = models.CharField("", max_length=10, choices=ATTENDANCE_TYPES)
	date =models.DateField(default=None)

	def as_json( self, *args, **kwargs):
		return self.__dict__

