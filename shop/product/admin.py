from django.contrib import admin
from .models import ProductModel, CartItemModel, ProductLikesModel
# Register your models here.
admin.site.register(ProductModel)
admin.site.register(CartItemModel)
admin.site.register(ProductLikesModel)
