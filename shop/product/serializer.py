from rest_framework import serializers
from .models import ProductModel, CartItemModel


class ProductSerializer(serializers.ModelSerializer):
    name = serializers.CharField(allow_blank=True)
    image_url = serializers.SerializerMethodField('get_image_url')
    tags = serializers.SerializerMethodField('get_tags')

    class Meta:
        model = ProductModel
        fields = ['id', 'slug', 'name', 'price', 'image_url', 'likes', 'tags', 'user_seler']

    def get_image_url(self, obj):
        return str(obj.image.url)

    def get_tags(self, obj):
        tags = []
        for tag in list(obj.tags.all()):
            tags.append(str(tag))
        return tags


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItemModel
        fields = ['product', 'quantity', 'id']
