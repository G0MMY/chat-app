from api.serializers import ChatRoomSerializer, CreateChatRoomSerializer, RoomMessagesSerializer, UserAuthSerializer, UsernameSerializer, UserRoomsSerializer, UserSerializer
from api.models import ChatRoom, UserRooms, RoomMessages
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

class CreateChatRoomView(APIView):
    serializer_class = CreateChatRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            name = serializer.data.get('name')
            queryset = ChatRoom.objects.filter(name=name)
            if not queryset.exists():
                chat_room = ChatRoom(name=name)
                chat_room.save()
                return Response(ChatRoomSerializer(chat_room).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class DeleteChatRoomView(APIView):
    serializer_class = UserRoomsSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            name = serializer.data.get('name')
            username = serializer.data.get('username')
            queryset = UserRooms.objects.filter(name=name, username=username)
            if queryset.exists():
                queryset[0].delete()
                queryset = UserRooms.objects.filter(name=name)
                if queryset.count() == 0:
                    queryset = ChatRoom.objects.filter(name=name)
                    if queryset.exists():
                        queryset[0].delete()
                        return Response({'Deleted': 'Deleted room'}, status=status.HTTP_200_OK)
                    else:
                        return Response({'Bad Request': 'Room not in chat room'}, status=status.HTTP_400_BAD_REQUEST)

                return Response({'Deleted': 'Deleted room link to user'}, status=status.HTTP_200_OK)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
                

class UserRoomsLinkView(APIView):
    serializer_class = UserRoomsSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            username = serializer.data.get('username')
            room_name = serializer.data.get('name')
            name = ChatRoom.objects.filter(name=room_name)
            if not name.exists():
                return Response({'Bad Request':'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
            queryset = UserRooms.objects.filter(name=room_name, username=username)
            if queryset.exists():
                return Response(UserRoomsSerializer(queryset[0]).data, status=status.HTTP_200_OK)
            else:
                user_room = UserRooms(username=username, name=room_name)
                user_room.save()
                return Response(UserRoomsSerializer(user_room).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request':'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class CreateUserView(APIView):
    serializer_class = UserSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer= self.serializer_class(data = request.data)
        if serializer.is_valid():
            username = serializer.data.get('username')
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            queryset = User.objects.filter(username=username)
            if queryset.exists():
                user = queryset[0]
                return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
            else:
                user = User.objects.create_user(username, email, password)
                user.save()
                return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class UserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserAuthView(APIView):
    serializer_class = UserAuthSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        username = request.data.get('username')
        password = request.data.get('password')    
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response(UserAuthSerializer(user).data, status=status.HTTP_202_ACCEPTED)

        return Response({'Not authorized': 'No user associated'}, status=status.HTTP_401_UNAUTHORIZED)


class UserLogoutView(APIView):
    serializer_class = UsernameSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        queryset = User.objects.filter(username=request.data.get('username'))
        if queryset.exists():
            if queryset[0].is_authenticated:
                logout(request)
                return Response({'Success': 'User logged out'}, status=status.HTTP_200_OK)
            return Response({'Not Authorized': 'User already logged out'}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({'Bad Request': 'Bad user input'}, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    serializer_class = UserAuthSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        queryset = User.objects.filter(username=request.data.get('username'))
        if queryset.exists():
            user = queryset[0]
            if not user.is_authenticated:
                login(request, user)
            return Response({'Success': 'User logged in'}, status=status.HTTP_200_OK)

        return Response({'Not authorized': 'User not found'}, status=status.HTTP_401_UNAUTHORIZED)

class UserRoomsView(generics.ListAPIView):
    serializer_class = UserRoomsSerializer
    queryset = UserRooms.objects.all()

class RoomMessagesView(generics.ListAPIView):
    serializer_class = RoomMessagesSerializer
    queryset = RoomMessages.objects.all()

class CreateRoomMessagesView(APIView):
    serializer_class = RoomMessagesSerializer

    def post(self, request, format=None): 
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            username = serializer.data.get('username')
            name = serializer.data.get('name')
            message = serializer.data.get('message')
            room_message = RoomMessages(username=username, name=name, message=message)
            room_message.save()
            return Response(RoomMessagesSerializer(room_message).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request':'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class DeleteRoomMessagesView(APIView):
    serializer_class = RoomMessagesSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        username = request.data.get('username')
        name = request.data.get('name')
        message = request.data.get('message')
        created_at = request.data.get('created_at')
        queryset = RoomMessages.objects.filter(username=username, name=name, message=message, created_at=created_at)
        if queryset.exists():
            room_message = queryset[0]
            room_message.delete()
            return Response({'Deleted':'message deleted successfully'}, status=status.HTTP_200_OK)

        return Response({'Bad Request':'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)