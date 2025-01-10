from django.contrib import admin
from phongtros.models import User, Tro, NguoiDung, BaiDang, BaiDangChoThue, City, District, Ward
from django.utils.html import mark_safe


class MyCourseAdmin(admin.AdminSite):
    site_header = 'Hệ thống tìm phòng trọ'

class UserAdmin(admin.ModelAdmin):
    # Chỉ hiển thị trường 'username' và 'password'
    fields = ('username', 'password','email','first_name', 'last_name','SDT')

    def save_model(self, request, obj, form, change):
        # Chỉ gán giá trị mặc định khi tạo mới người dùng
        if not change:  # Nếu đối tượng là mới (chưa lưu)
            obj.is_superuser = True
            obj.is_active = True  # Gán mặc định 'is_active' là True
            obj.is_staff = True  # Gán mặc định 'is_staff' là False
            # Băm mật khẩu trước khi lưu
            obj.set_password(form.cleaned_data['password'])
        super().save_model(request, obj, form, change)  # Gọi phương thức lưu của lớp cha

class NguoiDungAdmin(admin.ModelAdmin):
    fields = ('username', 'password', 'email', 'first_name', 'last_name', 'SDT', 'vaiTro', 'image', 'avatar')
    readonly_fields = ['avatar']

    def avatar(self, nguoidung):
            return mark_safe(f'<img src="/static/{nguoidung.image.name}" width="200" />')


    def save_model(self, request, obj, form, change):
        # Chỉ gán giá trị mặc định khi tạo mới người dùng
        if not change:  # Nếu đối tượng là mới (chưa lưu)
            obj.is_superuser = False
            obj.is_active = True  # Gán mặc định 'is_active' là True
            obj.is_staff = False  # Gán mặc định 'is_staff' là False
            # Băm mật khẩu trước khi lưu
            obj.set_password(form.cleaned_data['password'])
        super().save_model(request, obj, form, change)  # Gọi phương thức lưu của lớp cha

class TroAdmin(admin.ModelAdmin):
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'quan':
            if request.POST.get('thanh_pho'):
                thanh_pho_id = request.POST.get('thanh_pho')
                kwargs['queryset'] = District.objects.filter(parent_code_id=thanh_pho_id)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

admin_site = MyCourseAdmin()

admin_site.register(User,UserAdmin)
admin_site.register(NguoiDung,NguoiDungAdmin)
admin_site.register(Tro,TroAdmin)
admin_site.register(BaiDang)
admin_site.register(BaiDangChoThue)
admin_site.register(City)
admin_site.register(District)
admin_site.register(Ward)