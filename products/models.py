from django.db import models
from django.conf import settings
from django.urls import reverse
from autoslug import AutoSlugField
from core.models import TimeStampedModel
from mptt.models import MPTTModel
from mptt.fields import TreeForeignKey



def category_image_path(instance, filename):
  ext = filename.split('.')[-1]
  name = f"{instance.name}.{ext}"
  return "category/thambnail/{}".format(name)

def product_image_path(instance, filename):
  ext = filename.split('.')[-1]
  if instance.product:
    name = f"{instance.product.product_code}.{ext}"
    return "product/{0}/{1}/{2}".format(instance.product.category.category_id, instance.product.product_code, name)
  else:
    name = f"{instance.variant.product_code}.{ext}"
    return "product/{0}/{1}/{2}".format(instance.variant.product.category.category_id, instance.variant.product.product_code, name)


class Category(MPTTModel, TimeStampedModel):
  category_id = models.AutoField(primary_key=True)
  parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
  name = models.CharField(max_length=50)
  keywords = models.CharField(max_length=255, null=True, blank=True)
  description = models.TextField(null=True, blank=True)
  thambnail = models.ImageField(upload_to=category_image_path, blank=True, null=True)
  slug = AutoSlugField(populate_from='name', unique=True)
  is_active = models.BooleanField(default=True)

  def __str__(self):
    return self.name
  
  class MPTTMeta:
    order_insertion_by = ['name']
  
  def get_absolute_url(self):
    return reverse('category_detail', kwargs={'slug': self.slug})

  def __str__(self):                           # __str__ method elaborated later in
    full_path = [self.name]                  # post.  use __unicode__ in place of
    k = self.parent
    while k is not None:
      full_path.append(k.name)
      k = k.parent
    return ' > '.join(full_path[::-1])




class Product(TimeStampedModel):
  VARIANTS = (
    ('n', 'None'),
    ('c', 'Color'),
    ('s', 'Size'),
    ('cs', 'Color-Size'),
  )
  category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
  title = models.CharField(max_length=255)
  sku = models.CharField(max_length=200, null=True, blank=True)
  description = models.TextField(blank=True, null=True)
  price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
  stock = models.PositiveIntegerField(default=0)
  variant=models.CharField(max_length=2, choices=VARIANTS, default='n')
  slug = AutoSlugField(populate_from='title', unique=True)
  is_active = models.BooleanField(default=True)
  
  @property
  def product_code(self):
    return '{0}{1:0=8d}'.format(settings.PRODUCT_CODE_PREFIX or "", self.id)

  def __str__(self) -> str:
    return self.title

  class Meta:
    ordering = ['title']
  
  def get_absolute_url(self):
    return reverse('product_detail', kwargs={'slug': self.slug})



class Color(models.Model):
  name = models.CharField(max_length=20)
  code = models.CharField(max_length=10, blank=True,null=True)
  
  def __str__(self):
    return self.name



class Size(models.Model):
  code = models.CharField(max_length=10, blank=True,null=True)
  
  def __str__(self):
    return self.code



class ProductVariants(models.Model):
  product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
  color = models.ForeignKey(Color, on_delete=models.DO_NOTHING, related_name='product_variants', null=True, blank=True)
  size = models.ForeignKey(Size, on_delete=models.DO_NOTHING, related_name='product_variants', null=True, blank=True)
  price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
  stock = models.PositiveIntegerField(default=0)
  sku = models.CharField(max_length=200, null=True, blank=True)
  is_active = models.BooleanField(default=True)

  @property
  def product_code(self):
    return '{0}-c{1}-s{2}'.format(self.product.product_code, self.color or '', self.size or '')

  def __str__(self) -> str:
    return self.product.title if not self.color or self.size else f'{self.product.title}-c{self.color or ""}-s{self.size or ""}'



class ProductImage(models.Model):
  product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_images', null=True, blank=True)
  variant = models.ForeignKey(ProductVariants, on_delete=models.CASCADE, related_name='variant_images', null=True, blank=True)
  image = models.ImageField(upload_to=product_image_path, blank=True)

  def __str__(self) -> str:
    return self.product.product_code if self.product else self.variant.product_code
