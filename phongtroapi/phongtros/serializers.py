from rest_framework import serializers
from .models import User, Tro, AnhTro, BaiDang, BaiDangChoThue, BinhLuan, Chat, ChatText, ChatAnh

class UserSerializer(serializers.ModelSerializer):
    # Sử dụng serializer lồng nhau
    tuongTac = serializers.PrimaryKeyRelatedField(
        many=True, queryset=User.objects.all()
    )
    class Meta:
        model = User
        fields = ['id','email', 'username', 'first_name', 'last_name', 'SDT', 'image', 'vaiTro', 'tuongTac']

class User2(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','email', 'username', 'first_name', 'last_name', 'SDT']


# Serializer cho Tro
class TroSerializer(serializers.ModelSerializer):
    nguoiChoThue = User2()
    class Meta:
        model = Tro
        fields = ['id', 'tenTro', 'thanh_pho', 'quan', 'phuong', 'diaChi', 'nguoiChoThue', 'gia', 'soNguoiO']

# Serializer cho AnhTro
class AnhTroSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnhTro
        fields = ['id', 'tro', 'anh']

class TroDetailsSerializer(TroSerializer):
    anh_tros =AnhTroSerializer(many=True)

    class Meta:
        model = TroSerializer.Meta.model
        fields = TroSerializer.Meta.fields + ['anh_tros']


# Serializer cho BaiDang
class BaiDangSerializer(serializers.ModelSerializer):
    nguoiDangBai = User2()
    class Meta:
        model = BaiDang
        fields = ['id', 'tieuDe', 'thongTin', 'nguoiDangBai', 'created_date', 'updated_date']

# Serializer cho BaiDangChoThue ( kế thừa BaiDang)
class BaiDangChoThueSerializer(BaiDangSerializer):
    class Meta:
        model = BaiDangChoThue
        fields = BaiDangSerializer.Meta.fields + ['troChoThue']


# Serializer cho BinhLuan
class BinhLuanSerializer(serializers.ModelSerializer):
    class Meta:
        model = BinhLuan
        fields = ['id', 'thongTin', 'nguoiBinhLuan', 'baiDang', 'created_date', 'updated_date']


# Serializer cho Chat
class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['id', 'nguoiGui', 'nguoiNhan', 'thoiGianGui', 'daDoc']


# Serializer cho ChatText
class ChatTextSerializer(ChatSerializer):
    class Meta:
        model = ChatText
        fields = ChatSerializer.Meta.fields + ['noiDung']


# Serializer cho ChatAnh
class ChatAnhSerializer(ChatSerializer):
    class Meta:
        model = ChatAnh
        fields = ChatSerializer.Meta.fields + ['anh']