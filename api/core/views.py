from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics, status, pagination
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import CutUpdateSerializer, CutSerializer, CutListSerializer, ProducerSerializer, CutDetailSerializer
from .models import Cut, Producer
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate



def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(["POST"])
def register_user(request):
    data = request.data
    if User.objects.filter(username=data['username']).exists():
        return Response({"error": "User already exists."}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(
        username=data['username'],
        password=data['password'],
        # first_name=data['first_name'],
        # last_name=data['last_name'],
        email=data['email'])
    return Response(get_tokens_for_user(user), status=status.HTTP_201_CREATED)

@api_view(["POST"])
def login_user(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')
    if not User.objects.filter(username=username).exists():
        return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)
    
    user = authenticate(username=username, password=password)
    
    if user:
        tokens = get_tokens_for_user(user)
        return Response({"message": "Login successful.", **tokens}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Incorrect password"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(["GET"])
def get_user_info(request):
    user = request.user
    if not user.is_authenticated:
        return Response({"error": "User is not authenticated."}, status=status.HTTP_400_BAD_REQUEST)
    return Response({
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "is_superuser": user.is_superuser
        }, status=status.HTTP_200_OK)

class CutCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CutSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
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
    
