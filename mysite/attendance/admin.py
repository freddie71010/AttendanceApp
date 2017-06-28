from django.contrib import admin
from .models import Profile, Cohort, AttendanceRecord


class CohortAdmin(admin.ModelAdmin):
	list_display = ('cohort_name', 'start_date', 'graduation_date', 'is_active')

admin.site.register(Cohort, CohortAdmin)


class ProfileAdmin(admin.ModelAdmin):
	list_display = ('name', 'position', 'is_active')

	def name(self, obj):
		fullname = obj.user.first_name + " " + obj.user.last_name
		return fullname

admin.site.register(Profile, ProfileAdmin)


class AttendanceRecordsAdmin(admin.ModelAdmin):
	list_display = ('name', 'date', 'status')
	list_filter = ('user_id', 'date')

	def name(self, obj):
		fullname = obj.user.first_name + " " + obj.user.last_name
		return fullname
	
admin.site.register(AttendanceRecord, AttendanceRecordsAdmin)
