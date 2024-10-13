from django.contrib import admin
from .models import MessageModel, ChatModel
# Register your models here.
admin.site.register(MessageModel)
admin.site.register(ChatModel)
