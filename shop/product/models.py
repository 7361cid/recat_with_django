from django.db import models
from django.urls import reverse
from authentication.models import CustomUser
from computed_property import ComputedTextField
from taggit.managers import TaggableManager


# Create your models here.
class ProductModel(models.Model):
    class Meta:
        verbose_name = 'Продукт'
        verbose_name_plural = 'Продукты'
    id = models.IntegerField(default=0, primary_key=True)
    name = models.CharField(max_length=255, verbose_name=("Наименование"))
    slug = models.SlugField(unique_for_date='created', verbose_name=("Метка"))
    created = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, verbose_name='Описание')
    price = models.DecimalField(max_digits=15, decimal_places=2, verbose_name='Цена')
    image = models.ImageField(upload_to='products/%Y/%m/%d', blank=True, verbose_name='Фото')
    likes = ComputedTextField(compute_from='calculation_likes', default=0)
    tags = TaggableManager()
    user_seler = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=1)
#  TODO  смену кнопок лайк дизлайк
#  TODO  проблема пустой корзины
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
    class Meta:
        verbose_name = 'Корзина'
        verbose_name_plural = 'Корзины'
    product = models.ForeignKey(ProductModel, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.quantity} x {self.product.name}'

class PromocodModel(models.Model):
    class Meta:
        verbose_name = 'Промокод'
        verbose_name_plural = 'Промокоды'
    code = models.CharField(max_length=255, verbose_name=("XXX"))
    discount = models.PositiveIntegerField(default=0)

class ProductLikesModel(models.Model):
    class Meta:
        verbose_name = 'Лайк'
        verbose_name_plural = 'Лайки'
    product = models.ForeignKey(ProductModel, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
