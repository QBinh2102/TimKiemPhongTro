# myapp/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from phongtros import views
router = DefaultRouter()
router.register(r'users', views.UserViewSet)

router.register(r'tros', views.TroViewSet)
router.register(r'anhtros', views.AnhTroViewSet)
router.register(r'baidangs', views.BaiDangViewSet)
router.register(r'baidangchothues', views.BaiDangChoThueViewSet)
router.register(r'chattexts', views.ChatTextViewSet)
router.register(r'chatanhs', views.ChatAnhViewSet)
# router.register(r'users2', views.UserViewSet, basename='custom-user')

urlpatterns = [
    path('', include(router.urls)),
]