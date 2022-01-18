from rest_framework import serializers
from products.models import Category, Color, Product, ProductImage, ProductVariants, Size



class ColorSerializer(serializers.ModelSerializer):           # Color
  class Meta:
    model = Color
    fields = "__all__"


class SizeSerializer(serializers.ModelSerializer):            # Size
  class Meta:
    model = Size
    fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):        # Category
  class Meta:
    model = Category
    fields = "__all__"


class ProductImageSerializer(serializers.ModelSerializer):    # Image
  class Meta:
    model = ProductImage
    fields = "__all__"


class ProductVariantSerializer(serializers.ModelSerializer):   # Variants
  images = ProductImageSerializer(many=True)
  class Meta:
    model = ProductVariants
    fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):          # Products
  images = ProductImageSerializer(many=True)
  variants = ProductVariantSerializer(many=True)
  
  class Meta:
    model = Product
    fields = "__all__"
  
  def __init__(self, instance=None, **kwargs):
    if kwargs['context']['view'].action == 'list':
      del self.fields['variants']                     # Variants will not provide in list view
    super().__init__(instance, **kwargs)
