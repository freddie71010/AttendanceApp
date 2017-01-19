from django.conf.urls import url, include
from attendance.views import *

urlpatterns = [
	url(r'^index', Index.as_view(), name='index'),	
]
	