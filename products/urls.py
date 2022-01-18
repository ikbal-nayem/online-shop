from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, SizeViewSet, ColorViewSet, ProductViewSet


router = DefaultRouter()
router.register(r'color', ColorViewSet, basename='color')
router.register(r'size', SizeViewSet, basename='size')
router.register(r'category', CategoryViewSet, basename='category')
router.register(r'product', ProductViewSet, basename='product')

urlpatterns = router.urls