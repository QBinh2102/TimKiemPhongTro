from rest_framework import serializers
from .models import User, Tro, AnhTro, BaiDang, BaiDangChoThue, BinhLuan, Chat, ChatText, ChatAnh

class UserSerializer(serializers.ModelSerializer):
    # Sử dụng serializer lồng nhau
    tuongTac = serializers.PrimaryKeyRelatedField(
        many=True, queryset=User.objects.all()
    )
    class Meta:
        model = User
        fields = ['id','password','email', 'username', 'first_name', 'last_name', 'SDT', 'image', 'vaiTro', 'tuongTac','date_joined']
        extra_kwargs={
            'password':{'write_only':'true'}
        }
    def create(self, validated_data):

    # b 22/01
        tuong_tac_data = validated_data.pop('tuongTac', None)
        data = validated_data.copy()
        u = User(**data)
        u.set_password(u.password)
        if tuong_tac_data:
            tuong_tac_data = [int(pk) for pk in tuong_tac_data]
            u.tuongTac.set(tuong_tac_data)
        u.save()

        return u

        # tuong_tac_data = validated_data.pop('tuongTac', None)
        # password = validated_data.pop('password', None)

        # if tuong_tac_data:
        #     tuong_tac_data = [int(pk) for pk in tuong_tac_data]

        # user = User(**validated_data)
        # if password:
        #     user.set_password(password)
        # user.save()
        # if tuong_tac_data:
        #     user.tuongTac.set(tuong_tac_data)

        # return user

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['image'] = instance.image.url if instance.image else ''
        return data
    # b


class User2(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id']


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