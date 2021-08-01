from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('chat-room/<str:roomCode>', index),
    path('create-room', index),
    path('create-user', index),
    path('user-rooms', index),
]