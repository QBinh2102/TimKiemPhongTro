# myapp/views.py
from rest_framework import viewsets
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from django.db.models import Count
from django.db.models.functions import TruncYear, TruncQuarter, TruncMonth, ExtractYear
from .models import User, Tro, AnhTro, BaiDang, BaiDangChoThue, BinhLuan, Chat, ChatText, ChatAnh
from .serializers import (
    UserSerializer, TroSerializer, TroDetailsSerializer, AnhTroSerializer,
    BaiDangSerializer, BaiDangChoThueSerializer, BinhLuanSerializer,
    ChatSerializer, ChatTextSerializer, ChatAnhSerializer
)

# ViewSet cho User
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TroViewSet(viewsets.ModelViewSet):
    queryset = Tro.objects.filter(active=True)
    serializer_class = TroDetailsSerializer

    @action(methods=['post'], detail=True, url_path="hide_tro", url_name="hide-tro")
        #/tro/{pk}/hide_tro
    def hide_Tro(self, request, pk):
        try:
            t = Tro.objects.get(pk=pk)
            t.active = False
            t.save()
        except Tro.DoesNotExits:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(data=TroSerializer(t).data, status = status.HTTP_200_OK)

# ViewSet cho AnhTro
class AnhTroViewSet(viewsets.ModelViewSet):
    queryset = AnhTro.objects.all()
    serializer_class = AnhTroSerializer


# ViewSet cho BaiDang
class BaiDangViewSet(viewsets.ModelViewSet):
    queryset = BaiDang.objects.all()
    serializer_class = BaiDangSerializer

# ViewSet cho BaiDangChoThue
class BaiDangChoThueViewSet(BaiDangViewSet):
    queryset = BaiDangChoThue.objects.all()
    serializer_class = BaiDangChoThueSerializer

# ViewSet cho BinhLuan
class BinhLuanViewSet(viewsets.ModelViewSet):
    queryset = BinhLuan.objects.all()
    serializer_class = BinhLuanSerializer

# ViewSet cho Chat
class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer

# ViewSet cho ChatText
class ChatTextViewSet(ChatViewSet):
    queryset = ChatText.objects.all()
    serializer_class = ChatTextSerializer

# ViewSet cho ChatAnh
class ChatAnhViewSet(ChatViewSet):
    queryset = ChatAnh.objects.all()
    serializer_class = ChatAnhSerializer

def get_available_years(request):
    # Truy xuất danh sách năm từ dữ liệu ngày tạo tài khoản
    years = User.objects.annotate(year=ExtractYear('date_joined')).values_list('year', flat=True).distinct().order_by('year')
    return JsonResponse({'years': list(years)})

def user_stats_api(request):
    stat_type = request.GET.get('type')
    year = int(request.GET.get('year', 0))
    labels = []
    values = []

    if stat_type == 'year':
        data = User.objects.filter(date_joined__year__gte=year).annotate(
            year=TruncYear('date_joined')
        ).values('year').annotate(count=Count('id'))
        labels = [str(entry['year'].year) for entry in data]
        values = [entry['count'] for entry in data]

    elif stat_type == 'quarter':
        data = User.objects.filter(date_joined__year=year).annotate(
            quarter=TruncQuarter('date_joined')
        ).values('quarter').annotate(count=Count('id'))
        labels = ["Quý 1", "Quý 2", "Quý 3", "Quý 4"]

        values_dict = {f"{year}-Q{quarter}":0 for quarter in range(1,5)}
        for entry in data:
            quarter_number = (entry['quarter'].month - 1) // 3 + 1
            quarter_str = f"{year}-Q{quarter_number}"
            values_dict[quarter_str] = entry['count']

        values = list(values_dict.values())

    elif stat_type == 'month':
        data = User.objects.filter(date_joined__year=year).annotate(
            month=TruncMonth('date_joined')
        ).values('month').annotate(count=Count('id'))
        labels = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9",
                  "Tháng 10", "Tháng 11", "Tháng 12",]

        values_dict = {f"{year}-{month:02d}-01": 0 for month in range(1, 13)}
        for entry in data:
            month_str = entry['month'].strftime("%Y-%m-%d")
            values_dict[month_str] = entry['count']

        # Biến đổi thành danh sách giá trị tương ứng
        values = list(values_dict.values())
    return JsonResponse({'labels': labels, 'values': values})
