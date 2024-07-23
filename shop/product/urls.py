from .views import ProductView, ProductDetailView, ProductsApi, ProductsApiDetail, CartView, ProductBuyView,\
    CartDeleteView, ProductLikeView, ProductsLikesListApiView, ProductDislikeView, PromocodCheckView

from django.urls import path

urlpatterns = [
    path("", ProductView.as_view(), name="all_products"),
    path('<int:year>/<int:month>/<int:day>/<slug:post>/', ProductDetailView.as_view(), name="product"),
    path('api', ProductsApi.as_view(), name="product_api"),
    path('api/<int:product_id>', ProductsApiDetail.as_view(), name="product_api_detail"),
    path('api/cart/delete/<int:cartid>', CartDeleteView.as_view(), name="cart_delete"),
    path('api/cart/<int:userid>', CartView.as_view(), name="cart_api"),
    path('api/buy', ProductBuyView.as_view(), name="buy_api"),
    path('api/like', ProductLikeView.as_view(), name="like_product"),
    path('api/dislike', ProductDislikeView.as_view(), name="dislike_product"),
    path('api/likes_list', ProductsLikesListApiView.as_view(), name="likes_list"),
    path('api/promocod_check', PromocodCheckView.as_view(), name="promocod_check"),
]
