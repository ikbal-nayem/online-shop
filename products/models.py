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
  return "product/images/{}/{}".format(instance.product.title, filename)


class Category(MPTTModel, TimeStampedModel):
  STATUS = (('Active', 'Active'), ('Inactive', 'Inactive'))
  category_id = models.AutoField(primary_key=True)
  parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
  name = models.CharField(max_length=50)
  keywords = models.CharField(max_length=255)
  description = models.TextField(max_length=255)
  thambnail = models.ImageField(upload_to=category_image_path, blank=True)
  slug = AutoSlugField(populate_from='name', unique=True)
  status=models.CharField(choices=STATUS, max_length=8)

  def __str__(self):
    return self.name
  
  class MPTTMeta:
    order_insertion_by = ['name']
  
  def get_absolute_url(self):
    return reverse('category_detail', kwargs={'slug': self.slug})

  def __str__(self):                           # __str__ method elaborated later in
    full_path = [self.title]                  # post.  use __unicode__ in place of
    k = self.parent
    while k is not None:
      full_path.append(k.title)
      k = k.parent
    return ' / '.join(full_path[::-1])




class Product(TimeStampedModel):
  STATUS = (('Active', 'Active'), ('Inactive', 'Inactive'))
  VARIANTS = (
    ('n', 'None'),
    ('c', 'Color'),
    ('s', 'Size'),
    ('cs', 'Color-Size'),
  )
  category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
  title = models.CharField(max_length=255)
  sku = models.CharField(max_length=200, null=True, blank=True)
  product_code = models.CharField(max_length=15, primary_key=True, unique=True)
  description = models.TextField(blank=True)
  price = models.DecimalField(max_digits=12, decimal_places=2,default=0)
  stock = models.PositiveIntegerField(default=0)
  variant=models.CharField(max_length=2, choices=VARIANTS, default='n')
  slug = AutoSlugField(populate_from='title', unique=True)
  status=models.CharField(max_length=8, choices=STATUS)

  def __str__(self) -> str:
    return self.title

  class Meta:
    ordering = ['title']
  
  def save(self, *args, **kwargs):
    self.product_code = '{0}-{1:1=8d}'.format(settings.PRODUCT_CODE_PREFIX, Product.objects.all().count()+1)
    super(Product, self).save(*args, **kwargs)
  
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
  STATUS = (('Active', 'Active'), ('Inactive', 'Inactive'))
  product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
  color = models.ForeignKey(Color, on_delete=models.DO_NOTHING, related_name='product_variants')
  size = models.ForeignKey(Size, on_delete=models.DO_NOTHING, related_name='product_variants')
  price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
  stock = models.PositiveIntegerField(default=0)
  sku = models.CharField(max_length=200, null=True, blank=True)
  status=models.CharField(max_length=8, choices=STATUS)

  def __str__(self) -> str:
    return self.product



class ProductImage(models.Model):
  product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_images')
  variant = models.ForeignKey(ProductVariants, on_delete=models.CASCADE, related_name='variant_images', null=True, blank=True)
  image = models.ImageField(upload_to=product_image_path, blank=True)

  def __str__(self) -> str:
    return self.product
