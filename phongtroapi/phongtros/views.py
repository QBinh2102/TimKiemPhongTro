# myapp/views.py
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User, Tro, AnhTro, BaiDang, BaiDangChoThue, BinhLuan, Chat, ChatText, ChatAnh
from .serializers import (
    UserSerializer, TroSerializer, TroDetailsSerializer, AnhTroSerializer,
    BaiDangSerializer, BaiDangChoThueSerializer, BinhLuanSerializer,
    ChatSerializer, ChatTextSerializer, ChatAnhSerializer
)

# ViewSet cho User
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# ViewSet cho Tro
class TroViewSet(viewsets.ModelViewSet):
    queryset = Tro.objects.all()
    serializer_class = TroDetailsSerializer


# ViewSet cho AnhTro
class AnhTroViewSet(viewsets.ModelViewSet):
    queryset = AnhTro.objects.all()
    serializer_class = AnhTroSerializer


# ViewSet cho BaiDang
class BaiDangViewSet(viewsets.ModelViewSet):
    queryset = BaiDang.objects.all()
    serializer_class = BaiDangSerializer

# ViewSet cho BaiDangChoThue
class BaiDangChoThueViewSet(BaiDangViewSet):
    queryset = BaiDangChoThue.objects.all()
    serializer_class = BaiDangChoThueSerializer

# ViewSet cho BinhLuan
class BinhLuanViewSet(viewsets.ModelViewSet):
    queryset = BinhLuan.objects.all()
    serializer_class = BinhLuanSerializer

# ViewSet cho Chat
class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer


# ViewSet cho ChatText
class ChatTextViewSet(ChatViewSet):
    queryset = ChatText.objects.all()
    serializer_class = ChatTextSerializer


# ViewSet cho ChatAnh
class ChatAnhViewSet(ChatViewSet):
    queryset = ChatAnh.objects.all()
    serializer_class = ChatAnhSerializer
