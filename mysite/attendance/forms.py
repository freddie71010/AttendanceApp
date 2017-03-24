#forms.py
import re
from django import forms
from django.contrib.auth.models import User
from django.forms import ModelForm
from attendance.models import Profile, Cohort
from django.utils.translation import ugettext_lazy as _
 

class StudentRegistrationForm(forms.Form):
    first_name = forms.RegexField( regex=r'^[-a-zA-Z]+$', widget=forms.TextInput(attrs=dict(required=True, max_length=40)), label=_("First Name"), error_messages={'invalid' :_("This value must contain only letters")})
    last_name = forms.RegexField( regex=r'^[-a-zA-Z]+$', widget=forms.TextInput(attrs=dict(required=True, max_length=40)), label=_("Last Name"), error_messages={'invalid' :_("This value must contain only letters")})


    def clean_username(self):
        try:
            username = self.cleaned_data['first_name'] + "." + self.cleaned_data['last_name']
            user = User.objects.get(username__iexact=username)
        except User.DoesNotExist:
            return username
        raise forms.ValidationError(_("The username already exists. Please try another one."))


class CohortRegistrationForm(ModelForm):
    class Meta:
        model = Cohort
        fields = ["cohort_name", "teacher", "start_date", "graduation_date"]

    def __init__(self, *args, **kwargs):
        super(CohortRegistrationForm, self).__init__(*args, **kwargs)
        self.fields['teacher'] =  forms.ModelChoiceField(queryset=User.objects.filter(is_staff = True),empty_label="Select a teacher",)
        self.fields['start_date'].widget.attrs['class'] = 'datepicker'
        self.fields['graduation_date'].widget.attrs['class'] = 'datepicker'

