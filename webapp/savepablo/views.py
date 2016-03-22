from django.shortcuts import render, redirect
from django.contrib.auth import login,authenticate
from django.contrib.auth.decorators import login_required
from django.db import transaction
from forms import *
from models import *
from django.core.urlresolvers import reverse
from django.http import HttpResponse, Http404
import json
# Create your views here.


@login_required
def home(request):
  return render(request,'home.html',{})


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
                                   last_name=form.cleaned_data['last_name'])

  new_user.save()
  inst = MyUser(user = new_user)
    
  inst.save()

  user = authenticate(username=form.cleaned_data['user_name'], 
                    password=form.cleaned_data['password1'])
  login(request,user)
  
  return redirect(reverse('home'))

@login_required
def save(request):
 # items = request.POST['items'];
 # itemJ = json.loads(items)
 # for item in itemJ:
 #   obj = itemJ[item]
 #   inst = Item(user = request.user,name=obj['name'],mps=obj['mps'],count=['count'])
 #   inst.save() 
 
  return HttpResponse('success',content_type='text/plain');



