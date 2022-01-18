from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser

from products.models import Category, Color, Size, Product
from products.serializers import (
  CategorySerializer,
  SizeSerializer,
  ColorSerializer,
  ProductSerializer
)





class ColorViewSet(ModelViewSet):
  queryset = Color.objects.all()
  serializer_class = ColorSerializer
  authentication_classes = []
  permission_classes = [IsAuthenticatedOrReadOnly]

  def get_permissions(self):
    if self.action != 'list':
      return [IsAdminUser()]
    return super().get_permissions()



class SizeViewSet(ModelViewSet):
  queryset = Size.objects.all()
  serializer_class = SizeSerializer
  authentication_classes = []
  permission_classes = [IsAuthenticatedOrReadOnly]

  def get_permissions(self):
    if self.action != 'list':
      return [IsAdminUser()]
    return super().get_permissions()



class CategoryViewSet(ModelViewSet):
  queryset = Category.objects.filter(is_active=True)
  serializer_class = CategorySerializer
  authentication_classes = []
  permission_classes = [IsAuthenticatedOrReadOnly]
  lookup_field = 'slug'
  
  def get_permissions(self):
    if self.action != 'list' and self.action != 'retrieve':
      return [IsAdminUser()]
    return super().get_permissions()



class ProductViewSet(ModelViewSet):
  queryset = Product.objects.filter(is_active=True)
  serializer_class = ProductSerializer
  authentication_classes = []
  permission_classes = [IsAuthenticatedOrReadOnly]
  lookup_field = 'slug'
  
  def get_permissions(self):
    if self.action != 'list' and self.action != 'retrieve':
      return [IsAdminUser()]
    return super().get_permissions()