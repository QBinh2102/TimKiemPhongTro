# myapp/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, VaiTroViewSet, TroViewSet, AnhTroViewSet,
    BaiDangViewSet, BaiDangChoThueViewSet, BinhLuanViewSet,
    ChatViewSet, ChatTextViewSet, ChatAnhViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'vaitro', VaiTroViewSet, basename='vaitro')
router.register(r'tros', TroViewSet)
router.register(r'anhtror', AnhTroViewSet)
router.register(r'baidangs', BaiDangViewSet)
router.register(r'baidangchothues', BaiDangChoThueViewSet)
router.register(r'binhluans', BinhLuanViewSet)
router.register(r'chats', ChatViewSet)
router.register(r'chattexts', ChatTextViewSet)
router.register(r'chatanhs', ChatAnhViewSet)

urlpatterns = [
    path('api/', include(router.urls)),  # Bao gồm tất cả các URL từ router
]
