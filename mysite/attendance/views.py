from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import View
from attendance.models import *
from .forms import *
from django.contrib.auth.models import User
from django.contrib.auth.views import login
from django.contrib.auth import logout
from django.contrib.auth.forms import AuthenticationForm, UserChangeForm
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, JsonResponse
from django.core import serializers
import simplejson as json
from django.utils import timezone
from django.contrib.auth.decorators import permission_required

# Create your views here.


class Index(View):
	model = Cohort
	template = "teacher/index.html"


	def get(self, request):
		print(request.user.pk)
		cohorts = Cohort.objects.all()
		context = {"cohorts": cohorts }
		return render( request, self.template, context)

	def post(self, request, cohort_name):
		cohorts = Cohort.objects.all()
		context = {"cohorts": cohorts }
		return render( request, self.template, context)
		# result = Cohorts.Objects.filter(cohort_name=cohort_name)
		# return render(request,'templates/results.html', {"result": result} )

class RegisterStudent(View):
	form = StudentRegistrationForm(auto_id=True)

	def get(self, request):	
		template = "registration/register_student.html"
		print(request.user.id, request.user)
		return render(request, template, { "form":form })

	def post(self, request):
		form = StudentRegistrationForm(request.POST)
		if form.is_valid():
			data = form.cleaned_data
			new_user = User.objects.create_user(
				first_name = data["first_name"],
				last_name = data["last_name"],
				username  = data["fist_name"] + "." + data["last_name"]
				)
			new_user.save()
			associated_profile = Profile.objects.create_profile(
				user = new_user["pk"],
				position = "Student",
				created_by = request.user.pk,
				created_at = timezone.now
				)
			associated_profile.save()
			print("user and profile created by" + str(request.user))
			return HttpResponse(request, {"first_name":new_user["first_name"], "last_name": new_user["last_name"], "pk": new_user["pk"]})


class RegisterCohort(View):
	form = CohortRegistrationForm(auto_id=True)
	template = "registration/register_cohort.html"
	
	def get(self, request):
		form = CohortRegistrationForm(auto_id=True)
		template = "registration/register_cohort.html"
		return render(request, template, {"form":form})

	def post(self, request):
		template = "registration/register_cohort.html"
		form = CohortRegistrationForm(request.POST)
		if form.is_valid():
			data = form.cleaned_data
			new_cohort = Cohort.objects.create_cohort(
				cohort_name = data['cohort_name'],
				teacher = data['teacher'],
				created_at = timezone.now(),
				start_date = data['start_date'],
				created_by = request.user.pk,
				is_active = True,
				gratudation_date = data['graduation_date']
				)
			new = new_cohort.save()
			slug = new.slug
			print(slug)
			return redirect('/cohort/{}'.format(slug))
		else:
			print ("shits not working")
			return render(request, template, {"form":form} )

class CohortDetailView(View):
	template = "cohort_deail.html"

	def get(self, request, slug):
		cohort = Cohort.objects.get(slug=slug)
		context ={
			"cohort_name": cohort.cohort_name,
			"graduation": cohort.graduation_date,
			"start_date" : cohort.start_date,
			"teacher": cohort.teacher,
			"members": cohort.members,
		}
		return render(request, self.template, context)

	def post(self, request):
		pass

class StudentDetail(View):
	template = "student/detail.html"
	def get(self, request, id):
		user = User.objects.get(pk=id)
		profile = Profile.objects.get(pk=id)
		return render(request, self.template, {"user":user,"profile":profile})

	def post(self, request):
		pass

		# post will add information about the student
	def post(self, request, id):
		pass





