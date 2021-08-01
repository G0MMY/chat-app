import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ChatRoom from "./ChatRoom";
import CreateChatRoom from "./CreateChatRoom"; 
import Login from "./Login";
import CreateUser from "./CreateUser";
import UserRooms from "./UserRooms";

//sudo docker run -p 6379:6379 -d redis:5

export default function HomePage(){
    return(
        <Router>
            <Switch>
                <Route exact path='/' component={Login} />
                <Route path='/create-room' component={CreateChatRoom}/>
                <Route path='/chat-room/:name' render={
                    (props)=><ChatRoom {...props}/>
                }/>
                <Route path='/create-user' component={CreateUser}/>
                <Route path='/user-rooms' component={UserRooms}/>
            </Switch>
        </Router>
    )
}