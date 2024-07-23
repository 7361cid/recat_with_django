from .views import MessageView, MessageListView

from django.urls import path

urlpatterns = [
    path('api/message', MessageView.as_view(), name="create_messages"),
    path('api/get_message', MessageListView.as_view(), name="create_messages"),
]
