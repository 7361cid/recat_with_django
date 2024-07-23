from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from django.db.models import Q
from .models import MessageModel
from .serializer import MessageSerializer
from authentication.models import CustomUser

class MessageView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            MessageModel.objects.create(user_from=request.user, user_to=request.data['user_to'],
                                                   text=request.data['text'])
            return Response(f"Message create", status=status.HTTP_200_OK)
        except Exception as Exc:
            return Response(f"Message Not create {Exc}", status=status.HTTP_200_OK)

    # def get(self, request, *args, **kwargs):
    #     try:
    #         print(f" MessageView get {request.user}  {request.data} {request.query_params}")
    #         messages = MessageModel.objects.get(user_from=request.user, user_to=request.data['user_to'])
    #         serializer = MessageSerializer(messages)
    #         return Response(serializer.data)
    #     except Exception as Exc:
    #         return Response(f"Not Get messages {Exc}", status=status.HTTP_200_OK)


class MessageListView(ListAPIView):
    serializer_class = MessageSerializer
    queryset = MessageModel.objects.all()

    def get_queryset(self, *args, **kwargs):
        queryset = MessageModel.objects.all()
        user_id = self.request.query_params.get('userid', None)
        print(f"MessageListView request.user  "   # TODO нет фильтрации
              f"\n {self.request.user} \n {dict(self.request.GET)}")
        if dict(self.request.GET).get("owner_id"):
            user_list_id = [int(dict(self.request.GET).get("owner_id")[0]), self.request.user.id]
            print(f"MessageListView userlist_id {user_list_id} ")
            user_list = [CustomUser.objects.get(id=user_list_id[0]), CustomUser.objects.get(id=user_list_id[1])]
            print(f"MessageListView userlist {user_list_id} {user_list}")
            criterion1 = Q(user_from__in=user_list)
            criterion2 = Q(user_to__in=user_list_id)
            queryset.filter(criterion1 & criterion2)
            new_queryset = []
            for m in queryset:
                if m.user_to in user_list_id and m.user_from.id in user_list_id and m.user_to != m.user_from.id:
                    new_queryset.append(m)
                    print(f"{m} {m.user_to}  {m.user_from.id}")
            return new_queryset
        print(queryset)
        return queryset
