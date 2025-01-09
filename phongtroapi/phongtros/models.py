from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Model


class User(AbstractUser):
    pass


class Tro(models.Model):
    tenTro = models.CharField(max_length=255)
    anhTro = models.ImageField(upload_to='phongtros/%Y/%m/')
    diaChi = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.tenTro