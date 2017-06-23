from django.contrib import admin
from .models import Profile, Cohort


class CohortAdmin(admin.ModelAdmin):
	list_display = ('cohort_name', 'start_date', 'graduation_date', 'is_active')

admin.site.register(Cohort, CohortAdmin)


class ProfileAdmin(admin.ModelAdmin):
	list_display = ('name', 'position', 'is_active')

	def name(self, obj):
		fullname = obj.user.first_name + " " + obj.user.last_name
		return fullname

admin.site.register(Profile, ProfileAdmin)