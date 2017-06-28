from django.conf.urls import url
from attendance.views import *
from . import views

urlpatterns = [
	url(r'^$', login, name='login'),
	url(r'^login$', Login.as_view(), name='login'),
	url(r'^register_student$',RegisterStudent.as_view(), name='register_student'),
	url(r'^register_cohort$', RegisterCohort.as_view(), name='register_cohort'),	
	url(r'^logout$', logout_view, name='logout'),
	url(r'^cohorts$', Cohorts.as_view(), name='cohorts'),
	url(r'^cohort/(?P<cohort>[\w\-]+$)', CohortDetailView.as_view(), name='cohort_detail'),
	url(r'^profile/(?P<username>[.-_\w]+$)', ProfileDetailView.as_view(), name='profile_detail'),
	url(r'^take_attendance$', Attendance.as_view(), name='take_attendance'),
	url(r'^get_attendance$', Attendance.as_view(), name='get_attendance'),
	url(r'^students$', AllStudents.as_view(), name="allstudents"),
	url(r'^search$', Search.as_view(), name="search"),
	url(r'update_bio$', views.update_bio, name="update_bio"),
	url(r'update_final_project$', views.update_final_project, name="update_final_project"),
	url(r'update_profile_attendance$', views.update_profile_attendance, name="update_profile_attendance" )
	]