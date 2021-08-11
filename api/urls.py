from .views import CreateChatRoomView, CreateRoomMessagesView, CreateUserView, DeleteChatRoomView, DeleteRoomMessagesView, RoomMessagesView, UserAuthView, UserLogoutView, UserRoomsLinkView, UserRoomsView, UserView
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('create-room', CreateChatRoomView.as_view()),
    path('create-user', CreateUserView.as_view()),
    path('user', UserView.as_view()),
    path('user-auth', UserAuthView.as_view()),
    path('user-logout', UserLogoutView.as_view()),
    path('user-rooms', UserRoomsView.as_view()),
    path('user-rooms/link', UserRoomsLinkView.as_view()),
    path('room-messages', RoomMessagesView.as_view()),
    path('create-message', CreateRoomMessagesView.as_view()),
    path('delete-message', DeleteRoomMessagesView.as_view()),
    path('delete-room', DeleteChatRoomView.as_view()),
]