from rest_framework import serializers
from .models import MessageModel


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageModel
        fields = ['user_from', 'user_to', 'text']
