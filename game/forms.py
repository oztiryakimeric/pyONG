from django import forms


class UserForm(forms.Form):
    username = forms.CharField(label='Username', max_length=100)
    color = forms.CharField(label="Color (Html)", max_length=10)

