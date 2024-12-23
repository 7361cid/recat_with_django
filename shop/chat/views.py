from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import MessageModel, ChatModel
from .serializer import MessageSerializer
from authentication.models import CustomUser


class MessageView(APIView):
    def post(self, request, *args, **kwargs):
        """
        Создание сообщения
        """
        try:
            MessageModel.objects.create(message_owner_id=request.user.id, chat_id=request.data['chat_id'],
                                        text=request.data['text'])
            return Response(f"Message create", status=status.HTTP_200_OK)
        except Exception as Exc:
            return Response(f"Message Not create {Exc}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, *args, **kwargs):
        """
        получение переписки используя chat_id
        """
        chat_id = int(dict(self.request.GET)['chat_id'][0])
        chat_obj = ChatModel.objects.get(id=chat_id)
        if chat_obj.user_to != self.request.user.id:
            data = {"owner_id": chat_obj.user_to}
        else:
            data = {"owner_id": chat_obj.user_from.id}
        try:
            messages_obj = MessageModel.objects.filter(chat_id=chat_id)
            data["messages"] = MessageSerializer(messages_obj, many=True).data

        except MessageModel.DoesNotExist:
            data["messages"] = []
        return Response(data, status=status.HTTP_200_OK)


class ChatView(APIView):
    def get(self, request, *args, **kwargs):
        """
        Получение chat_id по id пользователей
        """
        user_from = CustomUser.objects.get(id=self.request.user.id)
        user_to = int(dict(self.request.GET)['owner_id'][0])
        chat_model_obj = ChatModel.objects.get_or_create(user_to=user_to, user_from=user_from)
        print(f"Chat View chat_model_obj {chat_model_obj[0]}")
        data = {"chat_id": chat_model_obj[0].id}
        return Response(data, status=status.HTTP_200_OK)

