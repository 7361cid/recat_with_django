from django.db import models
from django.urls import reverse
from authentication.models import CustomUser
from computed_property import ComputedTextField
from taggit.managers import TaggableManager


# Create your models here.
class ProductModel(models.Model):
    name = models.CharField(max_length=255, verbose_name=("Наименование"))
    slug = models.SlugField(unique_for_date='created', verbose_name=("Метка"))
    created = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, verbose_name='Описание')
    price = models.DecimalField(max_digits=15, decimal_places=2, verbose_name='Цена')
    image = models.ImageField(upload_to='products/%Y/%m/%d', blank=True, verbose_name='Фото')
    likes = ComputedTextField(compute_from='calculation_likes', default=0)
    tags = TaggableManager()

    @property
    def calculation_likes(self):
        queryset = ProductLikesModel.objects.all()
        return str(len(list(queryset.filter(product=self.id))))

    def get_absolute_url(self):
        return reverse('product',
                       args=[self.created.year,
                             self.created.month,
                             self.created.day,
                             self.slug])


class CartItemModel(models.Model):
    product = models.ForeignKey(ProductModel, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.quantity} x {self.product.name}'


class ProductLikesModel(models.Model):
    product = models.ForeignKey(ProductModel, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
