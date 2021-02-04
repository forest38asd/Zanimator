from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('tryAuth/', views.tryAuth, name='tryAuth'),
    path('register/', views.register, name='register'),
    path('logOut/', views.logOut, name='logout'),
]
