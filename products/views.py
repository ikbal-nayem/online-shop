from rest_framework.viewsets import ModelViewSet

from products.models import Category
from products.serializers import CategorySerializer



class CategoryViewSet(ModelViewSet):
  queryset = Category.objects.all()
  serializer_class = CategorySerializer
  authentication_classes = []
  lookup_field = 'slug'
