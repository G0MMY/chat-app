import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['name']
        self.room_group_name = 'chat-room_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        username = text_data_json['username']
        created_at = text_data_json['created_at']

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username,
                'created_at': created_at
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']
        username = event['username']
        created_at = event['created_at']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message,
            'username': username,
            'created_at': created_at,
        }))