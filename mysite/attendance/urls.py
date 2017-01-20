from django.conf.urls import url
from attendance.views import *


urlpatterns = [
	url(r'^login$', login),
	url(r'^register$',Register.as_view, name='register'),
	url(r'^logout$', logout),
	url(r'^index', Index.as_view(), name='index')
]
	