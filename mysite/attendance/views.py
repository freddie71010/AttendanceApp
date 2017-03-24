from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import View
from attendance.models import *
from .forms import *
from django.contrib.auth import logout, authenticate
from django.contrib.auth.models import User
from django.contrib.auth.views import login
from django.contrib.auth.forms import AuthenticationForm, UserChangeForm
from django.contrib.auth.decorators import permission_required, login_required
from django.utils.decorators import method_decorator
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.utils import timezone
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie

import simplejson as json
from datetime import datetime
from django.core import serializers



@method_decorator(login_required, name='dispatch') #due to CBV(class based views), we need to use insert the 'login_required' decorator into a method decorator in order for it to work (see django docs)
class Cohorts(View):
	
	model = Cohort
	template = "attendance/cohorts.html"
	form = CohortRegistrationForm

	def get(self, request):
		cohorts = Cohort.objects.all()
		context = {"cohorts": cohorts, "form":self.form()}
		return render(request, self.template, context)


class Login(View):
	def get(self, request):
		return redirect('/')

	def post(self, request):
		username = request.POST['username']
		password = request.POST['password']
		user = authenticate(username = username, password = password)
		if user is not None:
			login(request, user)
			print("User is successfully logged in as:", username)
			return redirect('/cohorts')
		else:
			return redirect('/')


@method_decorator(login_required, name='dispatch')
class RegisterStudent(View):
	
	def get(self, request):	
		pass

	def post(self, request):
		data = dict(request.POST)
		print("data:", data)
		new_user = User.objects.create(
			first_name = data["first_name"][0],
			last_name = data["last_name"][0],
			username  = data["first_name"][0] + "." + data["last_name"][0]
			)
		print("new user:", new_user)
		new_user.save()
		
		associated_profile = Profile.objects.create(
			user = new_user,
			position = "Student",
			created_by = request.user,
			final_project = "None"
			)
		associated_profile.save()

		associated_cohort = Cohort.objects.get(cohort_name=data["cohort_name"][0])
		associated_cohort.members.add(new_user)
		associated_cohort.save()

		print("==========user and profile created by: " + str(request.user) + "==========")
		return JsonResponse({"first_name": new_user.first_name, "last_name": new_user.last_name}, safe=False)


@method_decorator(login_required, name='dispatch')
class RegisterCohort(View):
	
	def get(self, request):
		pass

	def post(self, request):
		data = dict(request.POST)
		print(data)
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
		print("==========New Cohort has been registered")
		return JsonResponse({"cohort_name": new_cohort.cohort_name}, safe=False)

		# template = "register_cohort.html"
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
	

@method_decorator(login_required, name='dispatch')
class CohortDetailView(View):
	
	template = "attendance/cohort_detail.html"
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
			"date": timezone.now(),
		}
		return render(request, self.template, context)

	def post(self, request, cohort):
		pass


# WIP
@method_decorator(login_required, name="dispatch")
class ProfileUpdateView(View):
	template = "attendance/build_profile.html"
	
	def get(self, request):
		# I probably need to use local sotrage to get my user query.
		return render(request, self.template)

	def post(self, requst):
		data = dict(request.POST)
		user = User.objects.get(username=data["username"])



@method_decorator(login_required, name='dispatch')
class ProfileDetailView(View):
	
	template = "attendance/profile_detail.html"
	
	def get(self, request, username):
		user = User.objects.get(username=username)
		attendance = AttendanceRecord.objects.filter(user=user)
		cohort_info = user.cohort_set.values()   
		context = {
			"user": user,
			"attendance": attendance,
			"cohort":cohort_info[0],
		}
		return render(request, self.template, context)

	def post(self, request):
		pass


@method_decorator(login_required, name='dispatch')
class Attendance(View):

	template = "attendance/cohort_detail.html"

	def get(self, request):
		data = request.GET.dict()
		date = data["date_value"]
		print("Grab Attendance data".center(60, '='))
		for k, v in list(data.items()):
			name = k
			if name[0:7] != 'student':
				del data[k]
				pass
		date_records = AttendanceRecord.objects.all().filter(date=date)
		spec_date_records = {}
		error_check = 0
		for user in data:
			name = user
			user_obj = User.objects.get(username = name[18:-1])
			try:
				date_rec = date_records.get(user_id = user_obj.id)
			except: # if no date data is found in DB for that user, exit loop and return "NO_DATE_DATA_FOUND"
				print("\tError with:\t", user_obj)
				error_check += 1
				if len(data) == error_check:
					print("All attendance records missing: ", error_check, "/", len(data))
					return JsonResponse({"spec_date_records": "NO_DATE_DATA_FOUND"}, safe=False)
				continue
			print("user_obj:", user_obj, "\tid:",user_obj.id, '\tdate_rec:', date_rec.status)
			spec_date_records[user_obj.username] = date_rec.status
		print("RECORDS:",len(spec_date_records), spec_date_records)
		print("Attendance records missing: ", error_check, "/", len(data))
		return JsonResponse({"spec_date_records": spec_date_records}, safe=False)
	

	def post(self, request):
		data = request.POST.dict()
		date = data["date_value"]
		error_msg = []
		
		# Checks for 'undefined' entries and returns error message if any are found
		print("Undefined List check".center(60, '='))
		for key in data.keys():
			name = key
			status = data[name]
			if name[0:7] != 'student':
				pass
			else:
				status = data[name]
				if status == 'undefined':
					error_msg.append(name[18:-1])
		print("error_msg:",error_msg)
		if len(error_msg) != 0:
			return JsonResponse({"error_msg":error_msg}, safe=False)

		# Adds/updates attendance data
		print("Attendance data add/update".center(60, '='))

		for key in data.keys():
			print("KEY:",key)
			name = key
			status = data[name]
			if name[0:7] != 'student':
				print("Skipped...")
				pass
			else:
				user_instance = User.objects.get(username = name[18:-1])

				print("\tuser_instance:", user_instance, "\tid:",user_instance.id)
				obj, record = AttendanceRecord.objects.update_or_create(
					user_id=user_instance.id, date=date, 
					defaults = {'date':date, 'status':status}
					)
				print("\tRecord:",record)
				print("\tAttendance successfully submitted for " + name[18:-1])

		
		return JsonResponse({}, safe=False)


class Search(View):
	template = "attendance/search_results.html"
	# form data is not sending over properly
	def post(self, request):
		data = request.POST['search']
		print(data)
		user_obj = User.objects.filter(username__icontains=data)
		cohort_obj = Cohort.objects.filter(cohort_name__icontains=data)
		context = {
			"users": user_obj,
			"cohorts": cohort_obj,
		}
		return render(request, self.template, context)

	def get(self, request):
		return render(request, self.template)


@method_decorator(login_required, name='dispatch')
class AllStudents(View):
	template = "attendance/students.html"

	def get (self, request):
		# Includes only students; filters out admins
		students = User.objects.filter(is_staff = False)
		
		for student in students:
			try: 
				student.__dict__['final_project'] = student.profile.final_project
			except:
				student.__dict__['final_project'] = "-"
			
			try:
				student.__dict__['cohort_name'] = student.cohort_set.values()[0]['cohort_name']
			except:
				student.__dict__['cohort_name'] = "-"
			
			try:
				student.__dict__['cohort_start_date'] = student.cohort_set.values()[0]['start_date']
			except:
				student.__dict__['cohort_start_date'] = "-"
			
			try:
				student.__dict__['cohort_grad_date'] = student.cohort_set.values()[0]['graduation_date']
			except:
				student.__dict__['cohort_grad_date'] = "-"
			
		return render(request, self.template, {"students": students})

# logs out user
def logout_view(request):
	logout(request)
	print("User successfully logged out!")
	return redirect('/')
