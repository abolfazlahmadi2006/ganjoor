from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import CutSerializer, CutListSerializer, ProducerSerializer, CutDetailSerializer
from rest_framework import status
from .models import Cut, Roll, Producer, SewingHouseWorker


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
        
class CutListView(generics.ListAPIView):
    queryset = Cut.objects.all().select_related('owner')
    serializer_class = CutListSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['owner__person__name']
    # pagination_class = PageNumberPagination   # Use default pagination class from settings


class ProducerListView(generics.ListAPIView):
    queryset = Producer.objects.all().select_related('person')
    serializer_class = ProducerSerializer
    # pagination_class = PageNumberPagination   # Use default pagination class from settings

class CutDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cut.objects.all().select_related('owner').prefetch_related('rolls')
    print(queryset)
    serializer_class = CutDetailSerializer
    