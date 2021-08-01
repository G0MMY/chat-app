from api.models import ChatRoom, RoomMessages, UserRooms
from rest_framework import serializers
from django.contrib.auth.models import User

class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['name', 'created_at']

class CreateChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['name']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

class UsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

class UserAuthSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']

class UserRoomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRooms
        fields = ['username', 'name']

class RoomMessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomMessages
        fields = ['name', 'message', 'username', 'created_at']




