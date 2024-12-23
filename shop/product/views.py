import datetime
from django.shortcuts import render
from django.views import View
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.response import Response
from .models import ProductModel, CartItemModel, ProductLikesModel, PromocodModel
from .serializer import ProductSerializer, CartSerializer
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.db.models import Q
from taggit.models import Tag


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
        elif dict(self.request.GET).get("search_tag"):
            tag = dict(self.request.GET).get('search_tag')[0]
            tag_obj = Tag.objects.get(name=tag)
            # for p in ProductModel.objects.all():
            #     print(f"p={p} {p.tagged_items} ")  # {dir(p)}
            queryset = ProductModel.objects.all().filter(tags__name__in=[tag])
            print(f"get_queryset2 {tag} {tag_obj} {queryset}")
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
        products = self.get_object(product_id)
        serializer = ProductSerializer(products)
        return Response(serializer.data)


class ProductBuyView(APIView):
    def post(self, request, *args, **kwargs):
        """
        Добавление продукта в корзину
        """
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
            CartItemModel.objects.filter(product=product, user=request.user).delete()
            CartItemModel.objects.create(product=product, quantity=quantity, user=request.user)
        return Response("OK", status=status.HTTP_200_OK)


class ProductLikeView(APIView):
    """
    Поставить лайк продукту
    """
    def post(self, request, *args, **kwargs):
        product = ProductModel.objects.get(pk=request.data['product_id'])
        try:
            obj = ProductLikesModel.objects.get(product=product, user=request.user)
            # если лайк уже есть и это повторное нажатие, удаляем
            obj.delete()
        except ObjectDoesNotExist:
            ProductLikesModel.objects.create(product=product, user=request.user)
        return Response("IT's OK", status=status.HTTP_200_OK)


class PromocodCheckView(APIView):
    """
    Проверка промокода
    """
    def post(self, request, *args, **kwargs):
        try:
            promocod = PromocodModel.objects.get(code=request.data['promocod'])
            return Response(f"PROMOCOD CORECT DISCOUND {promocod.discount}", status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response("PROMOCOD NOT CORECT", status=status.HTTP_200_OK)


class CartDeleteView(APIView):
    def delete(self, request, cartid):
        my_object = CartItemModel.objects.filter(pk=cartid).first()
        if my_object:
            my_object.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
