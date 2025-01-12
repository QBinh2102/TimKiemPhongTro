# myapp/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from .views import (
    UserViewSet,  TroViewSet, AnhTroViewSet,
    BaiDangViewSet, BaiDangChoThueViewSet, ChatTextViewSet, ChatAnhViewSet
)


schema_view = get_schema_view(
    openapi.Info(
        title="Django API",
        default_version='v1',
        description="API documentation for my project",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@myapi.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
)
router = DefaultRouter()
router.register(r'users', UserViewSet)

router.register(r'tros', TroViewSet)
router.register(r'anhtror', AnhTroViewSet)
router.register(r'baidangs', BaiDangViewSet)
router.register(r'baidangchothues', BaiDangChoThueViewSet)


router.register(r'chattexts', ChatTextViewSet)
router.register(r'chatanhs', ChatAnhViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0),
         name='schema-swagger-ui'),
]