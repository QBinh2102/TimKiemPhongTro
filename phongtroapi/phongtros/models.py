from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Model
from enum import IntEnum

class VaiTro(IntEnum):
    QUANTRIVIEN = 1
    CHUNHATRO = 2
    NGUOITHUETRO = 3

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]

class User(AbstractUser):
    SDT = models.SmallIntegerField(null=True)
    vaiTro = models.IntegerField(choices=VaiTro.choices(),default=VaiTro.QUANTRIVIEN)

class NguoiDung(User):
    avatar = models.ImageField(upload_to='nguoidungs/%Y/%m')
    tuongTac = models.ManyToManyField("self")

class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    # updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Tro(BaseModel):
    tenTro = models.CharField(max_length=255)
    anhTro = models.ImageField(upload_to='phongtros/%Y/%m/')
    diaChi = models.CharField(max_length=255)
    nguoiChoThue = models.ForeignKey(NguoiDung, on_delete=models.CASCADE)
    gia = models.PositiveIntegerField()
    soNguoiO = models.SmallIntegerField()

    def __str__(self):
        return self.tenTro

class BaiDang(BaseModel):
    updated_date = models.DateTimeField(auto_now=True)
    nguoiDangBai = models.ForeignKey(NguoiDung, on_delete=models.CASCADE)

class BaiDangChoThue(BaiDang):
    troChoThue = models.ForeignKey(Tro, on_delete=models.CASCADE)

class BinhLuan(BaseModel):
    thongTin = models.CharField(max_length=255)
    updated_date = models.DateTimeField(auto_now=True)
    nguoiBinhLuan = models.ForeignKey(NguoiDung, on_delete=models.CASCADE)
    baiDang = models.ForeignKey(BaiDang,on_delete=models.CASCADE)