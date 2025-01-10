from django.contrib import admin
from phongtros.models import User, Tro, NguoiDung, BaiDang, BaiDangChoThue

class MyCourseAdmin(admin.AdminSite):
    site_header = 'Hệ thống tìm phòng trọ'

admin_site = MyCourseAdmin()

admin.site.register(User)
admin.site.register(NguoiDung)
admin.site.register(Tro)
admin.site.register(BaiDang)
admin.site.register(BaiDangChoThue)