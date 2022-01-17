from django.contrib import admin
from mptt.admin import DraggableMPTTAdmin
from .models import Category, Product, ProductVariants, ProductImage, Color, Size


@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
  list_display = ('name', 'code')
  list_display_links = ('name',)
  list_editable = ('code',)
  search_fields = ('name',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
  list_display = ('title', 'category', 'product_code', 'variant', 'price', 'stock', 'is_active')
  list_display_links = ('title', 'product_code', 'variant')
  list_editable = ('is_active', 'price', 'stock')
  search_fields = ('title', 'category', 'variant')
  list_filter = ('is_active', 'category')


@admin.register(ProductVariants)
class ProductVariantsAdmin(admin.ModelAdmin):
  list_display = ('product', 'color', 'size', 'sku', 'price', 'stock', 'is_active')
  list_display_links = ('product', 'sku')
  list_editable = ('is_active', 'price', 'stock')
  search_fields = ('product', 'sku')
  list_filter = ('is_active', 'product__category')


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
  list_display = ('product', 'variant', 'image')
  list_display_links = ('product', 'variant')
  list_editable = ('image',)
  search_fields = ('product', 'variant')
  list_filter = ('product__category',)


class CategoryAdmin(DraggableMPTTAdmin):
  mptt_indent_field = "name"
  list_display = ('tree_actions', 'indented_title',
                  'related_products_count', 'related_products_cumulative_count', 'is_active')
  list_display_links = ('indented_title',)
  list_editable = ('is_active',)
  # prepopulated_fields = {'slug': ('name',)}
  def get_queryset(self, request):
    qs = super().get_queryset(request)
    # Add cumulative product count
    qs = Category.objects.add_related_count(
            qs,
            Product,
            'category',
            'products_cumulative_count',
            cumulative=True)

    # Add non cumulative product count
    qs = Category.objects.add_related_count(qs,
              Product,
              'category',
              'products_count',
              cumulative=False)
    return qs

  def related_products_count(self, instance):
    return instance.products_count
  related_products_count.short_description = 'Related products (for this specific category)'

  def related_products_cumulative_count(self, instance):
    return instance.products_cumulative_count
  related_products_cumulative_count.short_description = 'Related products (in tree)'



admin.site.register(Size)
admin.site.register(Category, CategoryAdmin)