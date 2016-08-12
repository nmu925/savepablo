from django.contrib import admin
from models import *
# Register your models here.

class GameAdmin(admin.ModelAdmin):
    list_display = ('uuid','p1','p2')

class MyUserAdmin(admin.ModelAdmin):
    pass

admin.site.register(Game,GameAdmin)
admin.site.register(MyUser,MyUserAdmin)


