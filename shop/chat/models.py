from django.db import models
from authentication.models import CustomUser


class ChatModel(models.Model):
    class Meta:
        verbose_name = 'Чат'
        verbose_name_plural = 'Чаты'
    user_from = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    user_to = models.IntegerField(default=0)


class MessageModel(models.Model):
    class Meta:
        verbose_name = 'Сообщения'
        verbose_name_plural = 'Сообщения'
    chat_id = models.IntegerField(default=0)
    text = models.TextField(blank=True, verbose_name='Тело сообщения')
    date_added = models.DateTimeField(auto_now_add=True)
    message_owner_id = models.IntegerField(default=0)
