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
	template = "templates/index.html"
	cohorts = ''
	context = {"cohorts": cohorts }

	def get(self, request):
		context["cohorts"] = Cohorts.objects.all()
		return render( request, self.template, context)

	def post(self, request, cohort_name):
		pass
		# result = Cohorts.Objects.filter(cohort_name=cohort_name)
		# return render(request,'templates/results.html', {"result": result} )

class RegisterStudent(View):
	form = StudentRegistrationForm(auto_id=True)

	def get(self, request):	
		template = "templates/registration/register_student.html"
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
			associated_profile = Profile.objects.create_profile(
				user = new_user["pk"],
				position = "Student",
				created_by = request.user,
				created_at = timezone.now
				)
			print("user and profile created by" + str(request.user))
			return HttpResponse(request, {"first_name":new_user["first_name"], "last_name": new_user["last_name"], "pk": new_user["pk"]})


class RegisterCohort(View):
	form = CohortRegistrationForm(auto_id=True)
	def get(self, request):
		template = "template/registration/register_cohort"
		return(request, template,{"form":form})

	def post(self, request):
		form = CohortRegistrationForm(request.POST)
		if form.is_valid():
			pass