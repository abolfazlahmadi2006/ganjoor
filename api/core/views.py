from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics, status, pagination
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import CutUpdateSerializer, CutSerializer, CutListSerializer, ProducerSerializer, CutDetailSerializer
from .models import Cut, Producer
from rest_framework.filters import SearchFilter, OrderingFilter
from jdatetime import datetime as jdatetime
from datetime import datetime
from django.db.models import F, DateField


class CutCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CutSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request):
        return Response({"message": "GET method not allowed for this endpoint."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
        
class CutPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

 
class CutListView(generics.ListAPIView):
    queryset = Cut.objects.all().select_related('owner')
    serializer_class = CutListSerializer
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['owner__person__name']
    search_fields = ['cut_code', 'model_name']
    ordering_fields = ['create_date_gregorian']
    ordering = ['-create_date_gregorian']
    pagination_class = CutPagination


class ProducerListView(generics.ListAPIView):
    queryset = Producer.objects.all().select_related('person')
    serializer_class = ProducerSerializer
    # pagination_class = PageNumberPagination   # Use default pagination class from settings

class CutDetailView(generics.RetrieveDestroyAPIView):
    queryset = Cut.objects.all().select_related('owner').prefetch_related('rolls')
    serializer_class = CutDetailSerializer

class CutUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cut.objects.all().select_related('owner').prefetch_related('rolls')
    serializer_class = CutUpdateSerializer
    