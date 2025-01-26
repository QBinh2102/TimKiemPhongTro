# Generated by Django 5.1.4 on 2025-01-26 13:21

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('phongtros', '0004_alter_user_image_alter_user_tuongtac'),
        ('vi_address', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='baidang',
            name='thongTin',
            field=models.CharField(max_length=1000),
        ),
        migrations.AlterField(
            model_name='user',
            name='image',
            field=models.ImageField(null=True, upload_to='media/nguoidungs/%Y/%m/'),
        ),
        migrations.CreateModel(
            name='BaiDangTimPhong',
            fields=[
                ('baidang_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='phongtros.baidang')),
                ('phuong', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='vi_address.ward')),
                ('quan', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='vi_address.district')),
                ('thanh_pho', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='vi_address.city')),
            ],
            options={
                'abstract': False,
            },
            bases=('phongtros.baidang',),
        ),
    ]
