"""
URL configuration for phongtroapi project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include, re_path
from phongtros.views import user_stats_api, get_available_years
from phongtros.admin import admin_site
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Django API",
        default_version='v1',
        description="API documentation for my project",
        # terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@myapi.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
)

urlpatterns = [
    path('', include('phongtros.urls')),
    path('admin/', admin_site.urls),
    path('api/address/', include('vi_address.urls')),
    path('user-stats-api/', user_stats_api, name='user_stats_api'),
    path('get-available-years/', get_available_years, name='get_available_years'),
    # path('swagger/', schema_view.with_ui('swagger', cache_timeout=0),
    #      name='schema-swagger-ui'),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0),
            name='schema-json'),
    re_path(r'^swagger/$',
            schema_view.with_ui('swagger', cache_timeout=0),
            name='schema-swagger-ui'),
    re_path(r'^redoc/$',
            schema_view.with_ui('redoc', cache_timeout=0),
            name='schema-redoc'),
    re_path(r'^ckeditor/', include('ckeditor_uploader.urls')),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
]
