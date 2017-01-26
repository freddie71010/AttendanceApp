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
from django.views.decorators.csrf import csrf_protect
from datetime import datetime

class Index(View):
	model = Cohort
	template = "teacher/index.html"
	form = CohortRegistrationForm

	def get(self, request):
		
		cohorts = Cohort.objects.all()
		context = {"cohorts": cohorts, "form":self.form()}
		return render( request, self.template, context)



class RegisterStudent(View):
	form = StudentRegistrationForm

	# def get(self, request):	
	# 	template = "registration/register_cohort.html"
	# 	print(request.user.id, request.user)
	# 	return render(request, template, { "form": self.form() })

	def post(self, request):
		data = dict(request.POST)
		# print("Register Student view - cohort:", request.POST.cohort)
		new_user = User.objects.create(
			first_name = data["first_name"][0],
			last_name = data["last_name"][0],
			username  = data["first_name"][0] + "." + data["last_name"][0]
			)
		print("new user:", new_user)
		new_user.save()
		
		# need to figure out what needs to be put in user field
		associated_profile = Profile.objects.create(
			user = new_user,
			position = "Student",
			created_by = request.user,
			final_project = "None"
			)
		associated_profile.save()

		associated_cohort = Cohort.objects.get(cohort_name="Snuggles") ## WIP
		associated_cohort.members.add(new_user)
		associated_cohort.save()

		print("user and profile created by: " + str(request.user))
		blank_form = StudentRegistrationForm()
		return JsonResponse({"form": blank_form, "members": associated_cohort}, safe=False)

class RegisterCohort(View):
	form = CohortRegistrationForm
	template = "registration/register_cohort.html"
	
	def get(self, request):
		template = "registration/register_cohort.html"
		return render(request, template, {"form":self.form()})

	def post(self, request):
		data = dict(request.POST)
		start_date = data["start_date"][0]
		graduation_date = data["graduation_date"][0]
		teacher = User.objects.get(username = data["teacher"][0])
		start_date_from_timestamp = datetime.fromtimestamp(float(start_date[:-3]+'.000'))
		grad_date_from_timestamp = datetime.fromtimestamp(float(graduation_date[:-3]+'.000'))
		new_cohort = Cohort(
			cohort_name = data["cohort_name"][0],
			teacher = teacher,
			created_at = timezone.now(),
			start_date = start_date_from_timestamp,
			# created_by = request.user,
			is_active = False,
			graduation_date = grad_date_from_timestamp,
			)
		new_cohort.save()
		return JsonResponse({"cohort_name": new_cohort.cohort_name}, safe=False)

		# template = "registration/register_cohort.html"
		# form = CohortRegistrationForm(request.POST)
		# if form.is_valid():
		# 	data = form.cleaned_data
		# 	new_cohort = Cohort.objects.create(
		# 		cohort_name = data['cohort_name'],
		# 		teacher = data['teacher'],
		# 		created_at = timezone.now(),
		# 		start_date = data['start_date'],
		# 		created_by = request.user,
		# 		is_active = True,
		# 		graduation_date = data['graduation_date'],
		# 		)
		# 	new = new_cohort.save()
		# 	# slug = new.slug
		# 	# print(slug)
		# 	return redirect('/cohort/{}'.format(new_cohort["cohort_name"]))
		# else:
		# 	print ("shits not working")
		# 	return render(request, template, {"form":form} )
	





class CohortDetailView(View):
	template = "teacher/cohort_detail.html"
	form = StudentRegistrationForm()
	def get(self, request, cohort):
		print("cohort:", cohort)
		cohort = Cohort.objects.get(cohort_name=cohort)
		members = User.objects.all().filter(cohort=cohort)
		print ("members:", members, len(members))
		context = {
			"cohort_name": cohort.cohort_name,
			"graduation_date": cohort.graduation_date,
			"start_date" : cohort.start_date,
			"teacher": cohort.teacher,
			"members": members,
			"form": self.form,
		}
		return render(request, self.template, context)

	def post(self, request, cohort):
		pass


class ProfileDetailView(View):
	template = "profile/detail.html"
	def get(self, request, id):
		user = User.objects.get(pk=id)
		profile = Profile.objects.get(pk=id)
		return render(request, self.template, {"user":user,"profile":profile})

	def post(self, request):
		pass