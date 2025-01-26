# myapp/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from phongtros import views
from django.conf import settings
from django.conf.urls.static import static
router = DefaultRouter()
router.register(r'users', views.UserViewSet)

router.register(r'tros', views.TroViewSet)
router.register(r'anhtros', views.AnhTroViewSet)
router.register(r'baidangs', views.BaiDangViewSet)
router.register(r'binhluans', views.BinhLuanViewSet)
router.register(r'baidangchothues', views.BaiDangChoThueViewSet)
router.register(r'baidangtimphongs', views.BaiDangTimPhongViewSet)


# router.register(r'chattexts', views.ChatTextViewSet)
# router.register(r'chatanhs', views.ChatAnhViewSet)
# router.register(r'users2', views.UserViewSet, basename='custom-user')

urlpatterns = [
    path('', include(router.urls)),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
