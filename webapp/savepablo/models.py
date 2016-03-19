from django.db import models

# User class for built-in authentication module
from django.contrib.auth.models import User

class MyUser(models.Model):
  user = models.ForeignKey(MyUser)
  points = models.DecimalField(max_digits=11,decimal_places=0, default=0, blank=True)
  def __unicode__(self):
  	return self.user.username
  def __str__(self):
  	return self.__unicode__()