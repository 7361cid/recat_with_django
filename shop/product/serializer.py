from rest_framework import serializers
from .models import ProductModel, CartItemModel


class ProductSerializer(serializers.ModelSerializer):
    name = serializers.CharField(allow_blank=True)
    image_url = serializers.SerializerMethodField('get_image_url')
    tags = serializers.SerializerMethodField('get_tags')

    class Meta:
        model = ProductModel
        fields = ['id', 'slug', 'name', 'price', 'image_url', 'likes', 'tags']

    def get_image_url(self, obj):
        return str(obj.image.url)

    def get_tags(self, obj):
        print(f"get_tags  {list(obj.tags.all())}")
        tags = []
        for tag in list(obj.tags.all()):
            print(f"get_tags2  {dir(tag)}")
            tags.append(str(tag))
        print(f"get_tags3  {tags}")
        return tags

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItemModel
        fields = ['product', 'quantity', 'id']
