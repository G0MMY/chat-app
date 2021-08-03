# Chat App


This chat application is a web based application that allows different users to send messages between themselves. Each User can create a chat room or join one. A user can have multiple rooms linked to him. This projects run on localhost and uses docker for the chating channels. This means that the different users must all be on the same computer. 

I did this chat application to teach myself how to do a fullstack project and to understand how channels works. It made me learn a lot about django and, mainly, about the implementation of the backend of a web application. 


## How does it work


First, login 

![GitHub Logo](/images/login.png)


If you don't have an account, create one


![GitHub Logo](/images/create_user.png)


Then, you will be in the user room. You can then enter one of your rooms, join an existing room or create a new room


![GitHub Logo](/images/user_room.png)


If you go in a chat room, you can then send message to other users


![GitHub Logo](/images/chat_room.png)


If you want to create a room, only enter the name of it

![GitHub Logo](/images/create_room.png)


## Installation


You will need React, Python, Material-ui, Django, Node.js and Docker to try this app

After the download of all the files, go in your terminal in the general chat_app directory (the one who contains all the code). Then, run 'sudo docker run -p 6379:6379 -d redis:5', to start your docker image. After that, run 'python manage.py runserver', to start the localhost. Then, go in frontend and run 'npm run dev', to start the frontend server with react. You should now be good to go.

