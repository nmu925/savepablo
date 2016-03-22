from django.db import models

# User class for built-in authentication module
from django.contrib.auth.models import User

class MyUser(models.Model):
  user = models.ForeignKey(User)
  points = models.DecimalField(max_digits=11,decimal_places=0, default=0, blank=True)
  friends = models.ManyToManyField("self",symmetrical=True)



  def __unicode__(self):
  	return self.user.username
  def __str__(self):
  	return self.__unicode__()

class Item(models.Model):
  name = models.CharField(max_length = 20)
  mps = models.DecimalField(max_digits=100,decimal_places=1,default=0, blank=True)
  count = models.IntegerField()
  user = models.ForeignKey(User)
