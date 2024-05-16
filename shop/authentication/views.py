from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import MyTokenObtainPairSerializer, CustomUserSerializer
from product.models import CartItemModel

class ObtainTokenPairWithColorView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = MyTokenObtainPairSerializer


class CustomUserCreate(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format='json'):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    serializer = CustomUserSerializer(user, many=False)
    return Response(serializer.data)


class PaymentView(APIView):
    def get(self, request):
        total_price = 0
        user = request.user
        queryset = CartItemModel.objects.all()
        queryset.filter(user=user.id)
        for q in queryset:
            total_price += q.product.price * q.quantity
        print(total_price)
        if total_price < user.money:
            user.money = user.money - total_price
            user.save()
            queryset.delete()
            return Response("IT's OK", status=status.HTTP_200_OK)
        else:
            return Response("You are broke", status=status.HTTP_403_FORBIDDEN)
