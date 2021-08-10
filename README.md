# Chat App


This web-based chat application allows different users to send messages between themselves. Each user can create a chat room, join one and have multiple rooms. This project runs on localhost and uses docker for the chatting channels. I am currently building a mobile app and a personal server so different devices can talk together.  


My objective while doing this application was to teach myself how to do a full stack project and to understand how channels works. It made me learn a lot about Django and, mostly, about the implementation of the backend of a web application. 


## Try it

Go on http://184.161.7.138:8000 to interact with the application. It may not work if my internet is down or if I have no more power in my house.


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


## Installation


You will need React, Python, Material-ui, Node.js, Django, Django REST framework, Django channels, webpack, websocket, Channels Redis and Docker to try this app

After the download of all the files, go in your terminal in the general directory (the one who contains all the code). Run 'sudo docker run -p 6379:6379 -d redis:5', to start your docker image. Run 'python manage.py runserver', to start the localhost. Go in frontend and run 'npm run dev', to start the frontend server with react. You should now be good to go. 

