from django.urls import path
from .views import CutUpdateView, CutCreateView, ProducerListView, CutListView, CutDetailView, register_user, get_user_info, login_user
from .views_func import create_person, create_cut, person_list, cut_list, cut_detail, person_detail

views_func_urlpatterns = [
    path('  /', person_list, name='person_list'),
    path('create_person/', create_person, name='create_person'),
    path('create_cut/', create_cut, name='create_cut'),
    path('cut_list/', cut_list, name='cut_list'),
    path('cut/<str:cut_code>/', cut_detail, name='cut_detail'),
    path('person/<int:pk>/', person_detail, name='person_detail'),
]

urlpatterns = [
    path('cut-create-drf/', CutCreateView.as_view(), name='cut-create-drf'),
    path('cut-list/', CutListView.as_view(), name='cut-list'),
    path('producer-list/', ProducerListView.as_view(), name='producer-list'),
    path('cut-detail/<str:pk>/', CutDetailView.as_view(), name='cut-detail'),
    path('cut-update/<str:pk>/', CutUpdateView.as_view(), name='cut-update'),
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('user_info/', get_user_info, name='user-info'),
    
] + views_func_urlpatterns

