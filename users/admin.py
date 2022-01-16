from django.contrib import admin
from users.models import CustomUser, Profile, Address


@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
  list_display = ('get_full_name', 'user_id', 'email', 'is_active')
  list_display_links = ('user_id', 'get_full_name', 'email')
  list_filter = ('is_active', 'is_admin')
  list_editable = ('is_active',)
  search_fields = ('email', 'first_name', 'last_name')
  fieldsets = (
    (None, {'fields': ('first_name', 'last_name', 'email')}),
    ('Premissions', {'fields': ('is_admin', 'is_superuser')}),
    ('Auth', {'fields': ('is_active', 'password')})
  )


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
  list_display = ('user', 'gender', 'last_seen')
  list_display_links = ('user',)
  list_filter = ('user__is_active',)
  search_fields = ('user__first_name', 'user__last_name')


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
  list_display = ('user', 'phone_number', 'address_tag')
  list_display_links = ('user',)
  list_filter = ('user__is_active',)
  search_fields = ('user__first_name', 'user__last_name')
