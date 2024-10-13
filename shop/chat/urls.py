from .views import MessageView, ChatView

from django.urls import path

urlpatterns = [
    path('api/message', MessageView.as_view(), name="create_messages"),
    path('api/get_chat_id', ChatView.as_view(), name="get_chat_id"),
]
