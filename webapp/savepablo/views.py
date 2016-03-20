from django.shortcuts import render
from django.contrib.auth import login,authenticate
from django.contrib.auth.decorators import login_required
from django.db import transaction
# Create your views here.


@login_required
def home(request):
  return render(request,'home.html',{})

def register(request):

@transaction.atomic
def register(request):
  context = {}

  if request.method == 'GET':
    context['form'] = RegistrationForm()
    return render(request,'register.html',context)
  
  form = RegistrationForm(request.POST)
  context['form'] = form

  if not form.is_valid():
    return render(request,'register.html',context)

  new_user = User.objects.create_user(username=form.cleaned_data['user_name'],
                                     password=form.cleaned_data['password1'],
                                    first_name=form.cleaned_data['first_name'],
                                   last_name=form.cleaned_data['last_name'],
                                   email=form.cleaned_data['email'])
  new_user.is_active = False
  new_user.save()
  inst = UserProfile(user_name=form.cleaned_data['user_name'])
  userP = EditForm(request.POST,instance=inst)
    
  userP.save()
  
   context['email'] = form.cleaned_data['email']
  return render(request,'confirmEmail.html',context)
