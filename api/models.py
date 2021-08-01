from django.db import models
import string
import random


def random_code(length=8):
    code = ""
    i=0
    while i<length:
        letter = random.choice(string.ascii_uppercase)
        code +=letter

        i+=1
    
    if ChatRoom.objects.filter(code=code).count()==0:
        return code
    
    return random_code()

# Create your models here.
class ChatRoom(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=50, unique=True)

class UserRooms(models.Model):
    username = models.CharField(max_length=50)
    name = models.CharField(max_length=50)

class RoomMessages(models.Model):
    username = models.CharField(max_length=50)
    name = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    message = models.CharField(max_length=1000)

