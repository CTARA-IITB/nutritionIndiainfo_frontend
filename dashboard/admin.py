from django.contrib import admin
from .models import UtData
# Register your models here.

# class UtDataAdmin(admin.ModelAdmin):  
#   list_display = ('title', 'description', 'completed') 

# Register your models here.
admin.site.register(UtData) 


