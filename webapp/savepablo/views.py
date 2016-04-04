from django.shortcuts import render, redirect
from django.contrib.auth import login,authenticate
from django.contrib.auth.decorators import login_required
from django.db import transaction
from forms import *
from models import *
from django.core.urlresolvers import reverse
from django.http import HttpResponse, Http404
import json
from django.http import HttpResponseBadRequest
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist
from decimal import * 
from django.shortcuts import get_object_or_404
from django.db import transaction


# Used to generate a one-time-use token to 
from django.contrib.auth.tokens import default_token_generator
# Create your views here.


@login_required
def home(request):
  #Set opponent to null
  #Used as a soft reset in case the opponent is not reset at end of multiplayer game
  user = MyUser.objects.get(user=request.user)
  user.opponent = None
  user.queued = False
  user.save()
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
def click(request):
  user = MyUser.objects.get(user=request.user)
  points = user.points + user.mps
  
  user.points = points
  user.save()

  #json = serializers.serialize('json',user.points)
  return HttpResponse(points,content_type='text/plain')

@login_required
def mclick(request):
  user = MyUser.objects.get(user=request.user)
  points = user.mPoints + user.mMps
  
  user.mPoints = points
  user.save()

  #json = serializers.serialize('json',user.points)
  return HttpResponse(points,content_type='text/plain')



#Defines the mps for each item
def getMPS(item):
  if(item == 'yeezy'):
    return 1
  if(item == 'kim'):
    return 10
  if(item == 'tidal'):
    return 100
  if(item == 'gfm'):
    return 1000
  if(item == 'mark'):
    return 10000
#Defines the initial cost to buy each item
def getCost(item):
  if(item == 'yeezy'):
    return 1
  if(item == 'kim'):
    return 10
  if(item == 'tidal'):
    return 100
  if(item == 'gfm'):
    return 1000
  if(item == 'mark'):
    return 10000

@login_required
def bought(request):
  user = MyUser.objects.get(user=request.user)
  id = request.POST['id']
  data = {}
  if(not(id == 'yeezy' or id == 'kim' or id =='tidal' or id =='gfm' or id =='mark')):
    #Invalid items bought, return bad request
    return HttpResponseBadRequest()
  

  #Fetch item, update count 
  try:
    #update item
    owned = Item.objects.get(user=request.user,name=id)
    #check if item can be bought
    if(not(owned.cost <= user.points)):
      return HttpResponse()

    owned.count += 1
    ogCost = owned.cost
    owned.cost = owned.cost * Decimal(1.5) 
    owned.save()
    #update user mps
    user.points = user.points - ogCost
    user.mps += owned.mps
    user.save()
    #send data back to client
    data['id'] = str(id)
    data['mps'] = str(user.mps)
    data['cost'] = str(owned.cost)
    data['money'] = str(user.points)
    data['count'] = str(owned.count)
    jsonD = json.dumps(data)
    return HttpResponse(jsonD,content_type='application/json')

  except ObjectDoesNotExist:
    #create new item
    mpsNew = getMPS(id)
    ogCost = getCost(id)
    costNew = ogCost * 1.5
    #check if item can be bought
    if not(costNew <= user.points):
      return HttpResponse()
    new = Item(name=id,mps=mpsNew,count=1,cost=costNew,user=request.user)
    new.save()
    #update user mps/points
    user.points = user.points - ogCost
    user.mps += new.mps
    user.save() 
    #send data back to client
    data['id'] = str(id)
    data['mps'] = str(mpsNew)
    data['cost'] = str(costNew)
    data['money'] = str(user.points)
    data['count'] = '1'
    jsonD = json.dumps(data)
    return HttpResponse(jsonD,content_type='application/json')


@login_required
def mbought(request):
  user = MyUser.objects.get(user=request.user)
  id = request.POST['id']
  data = {}
  if(not(id == 'yeezy' or id == 'kim' or id =='tidal' or id =='gfm' or id =='mark')):
    #Invalid items bought, return bad request
    return HttpResponseBadRequest()
  

  #Fetch item, update count 
  try:
    #update item
    owned = mItem.objects.get(user=request.user,name=id)
    #check if item can be bought
    if(not(owned.cost <= user.points)):
      return HttpResponse()

    owned.count += 1
    ogCost = owned.cost
    owned.cost = owned.cost * Decimal(1.5) 
    owned.save()
    #update user mps
    user.mPoints = user.mPoints - ogCost
    user.mMps += owned.mps
    user.save()
    #send data back to client
    data['id'] = str(id)
    data['mps'] = str(user.mMps)
    data['cost'] = str(owned.cost)
    data['money'] = str(user.mPoints)
    data['count'] = str(owned.count)
    jsonD = json.dumps(data)
    return HttpResponse(jsonD,content_type='application/json')

  except ObjectDoesNotExist:
    #create new item
    mpsNew = getMPS(id)
    ogCost = getCost(id)
    costNew = ogCost * 1.5
    #check if item can be bought
    if not(costNew <= user.mPoints):
      return HttpResponse()
    new = mItem(name=id,mps=mpsNew,count=1,cost=costNew,user=request.user)
    new.save()
    #update user mps/points
    user.mPoints = user.mPoints - ogCost
    user.mMps += new.mps
    user.save() 
    #send data back to client
    data['id'] = str(id)
    data['mps'] = str(user.mMps)
    data['cost'] = str(costNew)
    data['money'] = str(user.mPoints)
    data['count'] = '1'
    jsonD = json.dumps(data)
    return HttpResponse(jsonD,content_type='application/json')

@login_required
def load(request):
    #Send user and corresponding items too client to load initial state
    user = MyUser.objects.get(user=request.user)
    items = Item.objects.filter(user=request.user)
    newL = list(items)
    newL.append(user)
    jsonD = serializers.serialize('json',newL)
    return HttpResponse(jsonD,content_type='application/json')


#increments points by mps for single player
@login_required
def step(request):
  user = MyUser.objects.get(user=request.user)
  user.points += user.mps
  user.save()
  data = {}
  data['money'] = str(user.points)
  return HttpResponse(json.dumps(data),content_type='application/json')

#increments points by mps for multi-player
@login_required
def mstep(request):
  user = MyUser.objects.get(user=request.user)
  user.mPoints += user.mMps
  user.save()
  data = {}
  data['money'] = str(user.mPoints)
  return HttpResponse(json.dumps(data),content_type='application/json')



#returns to multiplayer home
@login_required
def mHome(request):
  return render(request,'mHome.html',{})

@login_required
@transaction.atomic
def queue(request):

  user = MyUser.objects.get(user=request.user)
  if(not user.is_queued()):
    user.queued = True
    user.save()

  #Has existing opponenet
  if(not user.opponent == None):
    return HttpResponse('Found opponenent')
  set = MyUser.objects.filter(queued=True).exclude(user=request.user)
  count = set.count() 
  if(count == 0):
    return HttpResponseBadRequest()

  rando = set[0]
  rando.opponent = user
  user.opponent = rando
  rando.save()
  user.save()
  return HttpResponse('Found opponenent')

@transaction.atomic
@login_required
def ready(request):
  user = MyUser.objects.get(user=request.user)
  user.ready = True
  user.queued = False
  user.save()
  opp = user.opponent
  if(opp.is_ready()):
    return HttpResponse()
  return HttpResponseBadRequest()


#Initialize game with players
@login_required
def game(request):
    user = MyUser.objects.get(user=request.user)
    opp = user.opponent
    #temp_opp = User.objects.get(username='test0')
    #opp = MyUser.objects.get(user=temp_opp)
    count = Game.objects.filter(p1=user,p2=opp).count()
    if(count == 0):
      game = Game(p1=user,p2=opp)
      game.save()

    return render(request,'game.html',{})


@login_required
def getopp(request):
  user = MyUser.objects.get(user=request.user)
  opp = user.opponent
  qset = list(MyUser.objects.filter(user = opp.user))
  data = serializers.serialize('json',qset)
  return HttpResponse(data,content_type='application/json')

@login_required
def cancel(request):
  user = MyUser.objects.get(user=request.user)
  user.queued = False
  user.ready = False
  user.save()
  return HttpResponse()

@login_required
def link(request):
  
  # Generate a one-time use token for creating html
  token = default_token_generator.make_token(request.user)
  link = """ http://%s%s
      """ % (request.get_host(), 
            reverse('invite', args=[token]))
  return HttpResponse(link)

@login_required
def invite(request,token):

  if not default_token_generator.check_token(token):
    raise Http404
  
  return HttpResponse(token)
