from django.urls import path
from . import views

urlpatterns = [
    path(r'', views.checkAuth, name='index'),
    path('getCategoryData/', views.getCategoryData, name='getCategoryData'),
    path('addDurationToDatabase/', views.addDurationToDatabase, name='addDurationToDatabase'),
    path('delDurationFromBase/', views.delDurationFromBase, name='delDurationFromBase'),
]
