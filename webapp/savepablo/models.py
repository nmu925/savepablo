from django.db import models

# User class for built-in authentication module
from django.contrib.auth.models import User

class MyUser(models.Model):
  user = models.ForeignKey(User)
  points = models.DecimalField(max_digits=11,decimal_places=0, default=0, blank=True)
  friends = models.ManyToManyField("self",symmetrical=True)

  #Represents the quantity of each item/powerup, total of 10 items for now
  items = models.CommaSeparatedIntegerField(max_length=10)


  def __unicode__(self):
  	return self.user.username
  def __str__(self):
  	return self.__unicode__()



