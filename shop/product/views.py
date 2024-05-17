import datetime
from django.shortcuts import render
from django.views import View
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.response import Response
from .models import ProductModel, CartItemModel, ProductLikesModel
from .serializer import ProductSerializer, CartSerializer
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.db.models import Q


class ProductView(View):
    template_name = "products_all.html"

    def get(self, request, *args, **kwargs):
        products = ProductModel.objects.all()
        print(products)
        return render(request, self.template_name, {"products": products})


class ProductDetailView(View):
    template_name = 'product.html'

    def get(self, request, *args, **kwargs):
        date_in_url = datetime.date(self.kwargs['year'], self.kwargs['month'], self.kwargs['day'])
        product = ProductModel.objects.filter(created__date=date_in_url, slug=self.kwargs['post'])
        return render(request, self.template_name, {"product": product[0]})


class CartView(ListCreateAPIView):
    serializer_class = CartSerializer

    def get_queryset(self):
        queryset = CartItemModel.objects.all()
        user_id = self.request.query_params.get('userid', None)

        if user_id is not None:
            queryset = queryset.filter(user=user_id)
        print(queryset)
        return queryset


class ProductsApi(ListAPIView):
    queryset = ProductModel.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self, *args, **kwargs):
        if dict(self.request.GET).get("search"):
            queryset = ProductModel.objects.all().filter(Q(name__icontains=dict(self.request.GET).get("search")[0]))
            print(f"get_queryset {queryset} ")
        else:
            queryset = ProductModel.objects.all()

        return queryset


class ProductsApiDetail(APIView):
    def get_object(self, product_id):
        try:
            return ProductModel.objects.get(pk=product_id)
        except ProductModel.DoesNotExist:
            raise Http404

    def get(self, request, product_id):
        task = self.get_object(product_id)
        serializer = ProductSerializer(task)
        return Response(serializer.data)


class ProductBuyView(APIView):
    def post(self, request, *args, **kwargs):
        print(f"ProductBuyView {request.data}")
        product = ProductModel.objects.get(pk=request.data['product_id'])
        quantity = int(request.data['product_count'])

        try:
            cart_object = CartItemModel.objects.get(product=product, user=request.user)
            quantity += cart_object.quantity
            cart_object.delete()
            CartItemModel.objects.create(product=product, quantity=quantity, user=request.user)
        except ObjectDoesNotExist:
            CartItemModel.objects.create(product=product, quantity=quantity, user=request.user)
        except MultipleObjectsReturned:
            cart_objects = CartItemModel.objects.filter(product=product, user=request.user)
            for cart_obj in cart_objects:
                quantity += cart_obj.quantity
            print(f"ProductBuyView quantity  {quantity}")
            CartItemModel.objects.filter(product=product, user=request.user).delete()
            CartItemModel.objects.create(product=product, quantity=quantity, user=request.user)
        return Response("IT's OK", status=status.HTTP_200_OK)


class ProductLikeView(APIView):
    def post(self, request, *args, **kwargs):
        product = ProductModel.objects.get(pk=request.data['product_id'])
        try:
            ProductLikesModel.objects.get(product=product, user=request.user)
        except ObjectDoesNotExist:
            ProductLikesModel.objects.create(product=product, user=request.user)
        return Response("IT's OK", status=status.HTTP_200_OK)


class ProductDislikeView(APIView):
    def post(self, request, *args, **kwargs):
        product = ProductModel.objects.get(pk=request.data['product_id'])
        my_object = ProductLikesModel.objects.get(product=product, user=request.user)
        if my_object:
            my_object.delete()
        return Response("IT's OK", status=status.HTTP_200_OK)


class CartDeleteView(APIView):
    def delete(self, request, cartid):
        # pk is the primary key of the object to be deleted
        print(f"CartDeleteView {cartid}")
        my_object = CartItemModel.objects.filter(pk=cartid).first()
        print(my_object)
        if my_object:
            my_object.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


class ProductsLikesListApiView(APIView):
    """
    Return list of product ids that user liked
    """

    def get(self, request):
        queryset = ProductLikesModel.objects.filter(user=request.user)
        like_list = ""
        for like_obj in queryset:
            print(like_obj.product.pk)
            like_list += str(like_obj.product.pk) + ';'
        return Response(f"{like_list}", status=status.HTTP_200_OK)
