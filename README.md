# Chat App


This web-based chat application allows different users to send messages between themselves. Each user can create a chat room, join one and have multiple rooms. I am currently building a mobile app to go with this web app.  


My objective while doing this application was to teach myself how to do a full stack project and to understand how channels works. It made me learn a lot about Django and, mostly, about the implementation of the backend of a web application. 


## Installation

*Download the source code
*Run sudo docker run -p 6379:6379 -d redis:5
*Run python manage.py runserver
*cd in frontend
*Run npm install
*Run npm run dev

## How does it work


First, login 

![GitHub Logo](/images/login.png)


If you don't have an account, create one


![GitHub Logo](/images/create_user.png)


At this point, you will be in the user room. You can enter one of your rooms, leave a room, join an existing room or create a new room. 


![GitHub Logo](/images/user_room.png)


If you go in a chat room, you can send messages to other users or delete your own messages. You can also see the date when they were sent and from whom. 


![GitHub Logo](/images/chat_room.png)


If you want to create a room, only enter it’s name 


![GitHub Logo](/images/create_room.png)




