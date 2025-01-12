from rest_framework import serializers
from .models import User, VaiTro, Tro, AnhTro, BaiDang, BaiDangChoThue, BinhLuan, Chat, ChatText, ChatAnh
from vi_address.models import City, District, Ward

# Serializer cho User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'SDT', 'image', 'vaiTro', 'tuongTac']


class VaiTroSerializer(serializers.Serializer):
    value = serializers.IntegerField()
    name = serializers.CharField()

    def to_representation(self, instance):
        return {
            'value': instance.value,
            'name': instance.name
        }

# Serializer cho Tro
class TroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tro
        fields = ['id', 'tenTro', 'thanh_pho', 'quan', 'phuong', 'diaChi', 'nguoiChoThue', 'gia', 'soNguoiO']


# Serializer cho AnhTro
class AnhTroSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnhTro
        fields = ['id', 'tro', 'anh']


# Serializer cho BaiDang
class BaiDangSerializer(serializers.ModelSerializer):
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