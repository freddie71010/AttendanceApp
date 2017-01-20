from django.conf.urls import url
from attendance.views import *


urlpatterns = [
	url(r'^login$', login),
	url(r'^register_student$',RegisterStudent.as_view(), name='register_student'),
	url(r'^register_cohort$',RegisterCohort.as_view(), name='register_Cohort'),	
	url(r'^logout$', logout),
	url(r'^index', Index.as_view(), name='index')
]
	