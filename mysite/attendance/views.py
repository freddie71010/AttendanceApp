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

class Register(View):
	def get(self, request):
		template = "templates/registration/register.html"
		return render(request, template)

	def post(self, request):
		pass