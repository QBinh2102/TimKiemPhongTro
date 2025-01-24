from tempfile import template

from django import forms
from django.contrib import admin
from django.template.response import TemplateResponse

from phongtros.models import User, Tro, BaiDang, BaiDangChoThue, City, District, Ward, VaiTro, AnhTro, BinhLuan
from django.utils.html import mark_safe
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.urls import path


class MyTroAdmin(admin.AdminSite):
    site_header = 'Hệ thống tìm phòng trọ'

    def get_urls(self):
        return [
            path('tro-stats/', self.tro_stats)
        ] + super().get_urls()

    def tro_stats(self, request):
        user_count = User.objects.count()

        return TemplateResponse(request, 'admin/tro-stats.html', {
            'user_count' : user_count
        })

#--
class CustomTuongTacInline(admin.TabularInline):
    model = User.tuongTac.through
    fk_name = "from_user"
    extra = 0
    verbose_name_plural = "Danh sách tương tác"
    can_delete = False
    readonly_fields = ['to_user']

    def has_add_permission(self, request, obj):
        return False

    # Hiển thị tên người dùng tương tác thay vì ID
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        user_id = request.resolver_match.kwargs.get('object_id')
        if user_id:
            return queryset.filter(from_user_id=user_id)
        return queryset

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "to_user":
            user_id = request.resolver_match.kwargs.get('object_id')
            if user_id:
                current_user = User.objects.get(id=user_id)
                if current_user.vaiTro == VaiTro.NGUOITHUETRO:
                    kwargs["queryset"] = User.objects.filter(vaiTro=VaiTro.CHUNHATRO).exclude(id=user_id)
                elif current_user.vaiTro == VaiTro.CHUNHATRO:
                    kwargs["queryset"] = User.objects.filter(vaiTro=VaiTro.NGUOITHUETRO).exclude(id=user_id)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

class UserAdmin(admin.ModelAdmin):
    fields = ('username', 'password', 'email', 'first_name', 'last_name', 'SDT', 'vaiTro', 'image', 'avatar')
    list_display = ['username', 'email', 'SDT']
    search_fields = ['username']
    readonly_fields = ['avatar']
    inlines = [CustomTuongTacInline]

    def avatar(self, nguoidung):
        if nguoidung.image:
            return mark_safe(f'<img src="{nguoidung.image.url}" width="200" />')
        return "No Image"


    def save_model(self, request, obj, form, change):
        # Chỉ gán giá trị mặc định khi tạo mới người dùng
        if not change:
            if obj.vaiTro == VaiTro.QUANTRIVIEN:
                obj.is_superuser = True
                obj.is_staff = True
            else:
                obj.is_superuser = False
                obj.is_staff = False
            obj.is_active = True
            obj.set_password(form.cleaned_data['password'])
        super().save_model(request, obj, form, change)

# --
class CustomAnhTroInline(admin.TabularInline):
    model = AnhTro
    extra = 0
    verbose_name_plural = "Danh sách ảnh trọ"
    readonly_fields = ['image']
    can_delete = False

    # def has_add_permission(self, request, obj):
    #     return False

    def image(self, anhTro):
        return mark_safe(f'<img src="/static/{anhTro.anh.name}" width="150" />')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        tro_id = request.resolver_match.kwargs.get('object_id')
        if tro_id:
            return qs.filter(tro__id=tro_id)
        return qs

class TroAdmin(admin.ModelAdmin):
    inlines = [CustomAnhTroInline]
    list_display = ['tenTro', 'diaChi', 'phuong', 'quan', 'thanh_pho', 'soNguoiO', 'gia', 'nguoiChoThue', 'active']
    search_fields = ['tenTro']
    list_filter = ['gia']
    # readonly_fields = ['tenTro', 'diaChi', 'phuong', 'quan', 'thanh_pho', 'soNguoiO', 'gia', 'nguoiChoThue']

    # def has_add_permission(self, request):
    #     return False

# --
class CustomBinhLuanInline(admin.TabularInline):
    model = BinhLuan
    extra = 0
    verbose_name_plural = "Danh sách bình luận"
    can_delete = False
    readonly_fields = ['nguoiBinhLuan', 'thongTin']
    #
    # def has_add_permission(self, request, obj):
    #     return False

    def get_queryset(self, request):
        bl = super().get_queryset(request)
        baiDang_id = request.resolver_match.kwargs.get('object_id')
        if baiDang_id:
            return bl.filter(baiDang__id=baiDang_id)
        return bl

class BaiDangForm(forms.ModelForm):
    # thongTin = forms.CharField(widget=CKEditorUploadingWidget)
    thongTin = forms.CharField()
    class Meta:
        model = BaiDang
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['nguoiDangBai'].queryset = User.objects.filter(vaiTro=VaiTro.NGUOITHUETRO)

class BaiDangAdmin(admin.ModelAdmin):
    inlines = [CustomBinhLuanInline]
    list_display = ['tieuDe', 'created_date', 'nguoiDangBai']
    search_fields = ['tieuDe']
    list_filter = ['created_date', 'nguoiDangBai']
    form = BaiDangForm
    #
    # def has_add_permission(self, request):
    #     return False

    def get_queryset(self, request):
        # Lọc chỉ các bài đăng thuộc lớp BaiDang, không bao gồm các lớp con
        return super().get_queryset(request).filter(baidangchothue__isnull=True)

class BaiDangChoThueForm(forms.ModelForm):
    class Meta:
        model = BaiDangChoThue
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['nguoiDangBai'].queryset = User.objects.filter(vaiTro=VaiTro.CHUNHATRO)

class BaiDangChoThueAdmin(admin.ModelAdmin):
    inlines = [CustomBinhLuanInline]
    list_display = ['tieuDe', 'created_date', 'nguoiDangBai']
    search_fields = ['tieuDe']
    list_filter = ['created_date', 'nguoiDangBai']
    form = BaiDangChoThueForm

    # def has_add_permission(self, request):
    #     return False

admin_site = MyTroAdmin()

admin_site.register(User,UserAdmin)
# admin_site.register(AnhTro)
admin_site.register(Tro,TroAdmin)
admin_site.register(BaiDang,BaiDangAdmin)
admin_site.register(BaiDangChoThue,BaiDangChoThueAdmin)
admin_site.register(BinhLuan)
admin_site.register(City)
admin_site.register(District)
admin_site.register(Ward)