from rest_framework import serializers
from .models import MessageModel


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageModel
        fields = ['chat_id', 'text', 'date_added', 'message_owner_id']
