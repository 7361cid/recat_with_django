from django.db import models
from authentication.models import CustomUser


class MessageModel(models.Model):
    user_from = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    user_to = models.IntegerField(default=0)
    text = models.TextField(blank=True, verbose_name='Тело сообщения')
    date_added = models.DateTimeField(auto_now_add=True)
