from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ObjectDoesNotExist

from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import MyTokenObtainPairSerializer, CustomUserSerializer
from product.models import CartItemModel, PromocodModel

class ObtainTokenPairWithColorView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = MyTokenObtainPairSerializer


class CustomUserCreate(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format='json'):
        if request.data['password'] != request.data['password2']:
            return Response({'password': "Пароли не совпадают"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        else:
            print(f"CustomUserCreate {serializer.errors} data {request.data}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    serializer = CustomUserSerializer(user, many=False)
    return Response(serializer.data)


class PaymentView(APIView):
    def get(self, request):
        discount = 0
        if dict(self.request.GET).get("promocod"):
            print(f"promocod DEBUG {dict(self.request.GET).get('promocod')}")
            try:
                promocod = PromocodModel.objects.get(code=dict(self.request.GET).get('promocod')[0])
                discount = promocod.discount
            except ObjectDoesNotExist:
                print(f"No promocod {dict(self.request.GET).get('promocod')[0]}")

        total_price = 0
        user = request.user
        queryset = CartItemModel.objects.all()
        queryset.filter(user=user.id)
        for q in queryset:
            total_price += q.product.price * q.quantity
        print(total_price)
        total_price = total_price - discount * total_price/100
        print(f"PAYMENT VIEW {list(queryset)}")
        if len(list(queryset)) == 0:
            return Response("Корзина пустая", status=status.HTTP_403_FORBIDDEN)
        if total_price < user.money:
            user.money = user.money - total_price
            user.save()
            queryset.delete()
            return Response("OK", status=status.HTTP_200_OK)
        else:
            return Response("Мало денег", status=status.HTTP_403_FORBIDDEN)
