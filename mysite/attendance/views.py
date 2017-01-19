from django.shortcuts import render
from django.views.generic import View
from attendance.models import *

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
		result = Cohorts.Objects.filter(cohort_name=cohort_name)
		return render(request,'templates/results.html', {"result": result} )