from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Model, CASCADE
from vi_address.models import City, District, Ward
from enum import IntEnum

class VaiTro(IntEnum):
    QUANTRIVIEN = 1
    CHUNHATRO = 2
    NGUOITHUETRO = 3

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]

class User(AbstractUser):
    SDT = models.CharField(max_length=10)
    image = models.ImageField(upload_to='nguoidungs/%Y/%m')
    vaiTro = models.IntegerField(choices=VaiTro.choices(), default=VaiTro.QUANTRIVIEN)
    tuongTac = models.ManyToManyField("self")

    class Meta:
        verbose_name_plural = 'Người dùng'

class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    # updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class AnhTro(models.Model):
    tro = models.ForeignKey('Tro', on_delete=models.CASCADE)
    anh = models.ImageField(upload_to='phongtros/%Y/%m/')

    def __str__(self):
        return f'Ảnh của {self.tro.tenTro}'

    class Meta:
        verbose_name_plural = 'Ảnh Trọ'

class Tro(BaseModel):
    tenTro = models.CharField(max_length=255)
    thanh_pho = models.ForeignKey(City, null=True, blank=True, on_delete=models.SET_NULL)
    quan = models.ForeignKey(District, null=True, blank=True, on_delete=models.SET_NULL)
    phuong = models.ForeignKey(Ward, null=True, blank=True, on_delete=models.SET_NULL)
    diaChi = models.CharField(max_length=255)
    nguoiChoThue = models.ForeignKey(User, on_delete=models.CASCADE)
    gia = models.PositiveIntegerField()
    soNguoiO = models.SmallIntegerField()

    def __str__(self):
        return self.tenTro

    class Meta:
        verbose_name_plural = 'Trọ'

class BaiDang(BaseModel):
    tieuDe = models.CharField(max_length=255)
    updated_date = models.DateTimeField(auto_now=True)
    thongTin = models.TextField()
    nguoiDangBai = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.tieuDe

    class Meta:
        verbose_name_plural = 'Bài đăng'

class BaiDangChoThue(BaiDang):
    troChoThue = models.ForeignKey(Tro, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = 'Bài đăng cho thuê'

class BinhLuan(BaseModel):
    thongTin = models.TextField()
    updated_date = models.DateTimeField(auto_now=True)
    nguoiBinhLuan = models.ForeignKey(User, on_delete=models.CASCADE)
    baiDang = models.ForeignKey(BaiDang,on_delete=models.CASCADE)

class Chat(BaseModel):
    nguoiGui = models.ForeignKey(User, on_delete=models.PROTECT, related_name='tin_nhan_gui')
    nguoiNhan = models.ForeignKey(User, on_delete=models.PROTECT, related_name='tin_nhan_nhan')
    thoiGianGui = models.DateTimeField(auto_now_add=True)
    daDoc = models.BooleanField(default=False)

class ChatText(Chat):
    noiDung = models.TextField()

class ChatAnh(Chat):
    anh = models.ImageField(upload_to='chats/%Y/%m')