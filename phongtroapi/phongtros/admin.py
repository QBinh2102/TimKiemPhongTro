from django import forms
from django.contrib import admin, messages
from django.core.exceptions import ValidationError
from phongtros.models import User, Tro, BaiDang, BaiDangChoThue, City, District, Ward, VaiTro, AnhTro, BinhLuan
from django.utils.html import mark_safe


class MyCourseAdmin(admin.AdminSite):
    site_header = 'Hệ thống tìm phòng trọ'

class UserAdmin(admin.ModelAdmin):
    # Chỉ hiển thị trường 'username' và 'password'
    fields = ('username', 'password', 'email', 'first_name', 'last_name', 'SDT', 'vaiTro', 'image', 'avatar')
    list_display = ['username', 'email', 'SDT']
    search_fields = ['username']
    readonly_fields = ['avatar']

    def avatar(self, nguoidung):
        return mark_safe(f'<img src="/static/{nguoidung.image.name}" width="200" />')

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
        super().save_model(request, obj, form, change)  # Gọi phương thức lưu của lớp cha

class TroForm(forms.ModelForm):
    class Meta:
        model = Tro
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Lọc người dùng có vai trò là CHUNHATRO
        self.fields['nguoiChoThue'].queryset = User.objects.filter(vaiTro=VaiTro.CHUNHATRO)


class CustomAnhTroInline(admin.TabularInline):
    model = AnhTro
    extra = 0
    readonly_fields = ['image']

    def image(self, anhTro):
        return mark_safe(f'<img src="/static/{anhTro.anh.name}" width="150" />')

    image.short_description = "Ảnh"

    def has_delete_permission(self, request, obj=None):
        if obj:
            current_count = AnhTro.objects.filter(tro=obj).count()
            if current_count <= 3:
                return False
        return super().has_delete_permission(request, obj)

    def get_queryset(self, request):
        # Lọc ảnh chỉ liên quan đến trọ đang chỉnh sửa
        qs = super().get_queryset(request)
        tro_id = request.resolver_match.kwargs.get('object_id')
        if tro_id:
            return qs.filter(tro__id=tro_id)
        return qs

class TroAdmin(admin.ModelAdmin):
    form = TroForm
    inlines = [CustomAnhTroInline]
    list_display = ['tenTro', 'diaChi', 'phuong', 'quan', 'thanh_pho', 'soNguoiO', 'gia', 'nguoiChoThue', 'active']
    search_fields = ['tenTro']
    list_filter = ['gia']

    def has_add_permission(self, request):
        return False

class CustomBinhLuanInline(admin.TabularInline):
    model = BinhLuan
    extra = 0
    readonly_fields = ['nguoiBinhLuan', 'thongTin']

    def get_queryset(self, request):
        bl = super().get_queryset(request)
        baiDang_id = request.resolver_match.kwargs.get('object_id')
        if baiDang_id:
            return bl.filter(baiDang__id=baiDang_id)
        return bl

class BaiDangForm(forms.ModelForm):
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

    def has_add_permission(self, request):
        return False

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

    def has_add_permission(self, request):
        return False

admin_site = MyCourseAdmin()

admin_site.register(User,UserAdmin)
# admin_site.register(AnhTro)
admin_site.register(Tro,TroAdmin)
admin_site.register(BaiDang,BaiDangAdmin)
admin_site.register(BaiDangChoThue,BaiDangChoThueAdmin)
# admin_site.register(BinhLuan)
admin_site.register(City)
admin_site.register(District)
admin_site.register(Ward)