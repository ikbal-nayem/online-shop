from django.contrib import admin
from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from django.urls.conf import include


urlpatterns = [
    path('super-admin/', admin.site.urls),
    path('api/user/', include('users.urls')),
    path('api/', include('products.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
