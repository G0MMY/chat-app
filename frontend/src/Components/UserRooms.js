import React, { useEffect, useState } from "react";
import { Grid, Button, Typography, TextField, Snackbar } from "@material-ui/core";
import { Link } from "react-router-dom";
import Alert from "./Alert";

export default function UserRooms(props){
    const [rooms, setRooms] = useState([])
    const [room_user, setRoomUser] = useState([])
    const [username, setUsername] = useState("")
    const [name, setName] = useState("")
    const [open_error, setOpenError] = useState(false)
    const [error, setError] = useState(false)

    useEffect(()=>{
        if (props.location.state !== undefined && props.location.state.is_auth === true){
            setUsername(props.location.state.username)
            fetch('/api/user-rooms').then((response)=>response.json()).then((data)=>{
                let room = []
                let user = []
                data.forEach(element => {
                    if (element.username === props.location.state.username){
                        room.push(element.name)
                        data.forEach(elem=>{
                            if (elem.name === element.name){
                                user.push([elem.name, elem.username])
                            }
                        })
                    }
                })
                setRooms(room)
                setRoomUser(user)
            })
        } else {
            props.history.push('/')
        }
    },[])

    const handleJoinRoomChange = (e)=>{
        setName(e.target.value)
    }

    const roomUserBuilder = (index)=>{
        let result = []
        room_user.forEach((element)=>{
            if (element[0]===rooms[index]){
                result.push(<li>{element[1]}</li>)
            }
        })
        return result
    }

    const UserRoom = (index)=>{
        const room_link = '/chat-room/'+rooms[index]
        return (
            <div className="room" id={rooms[index]} onMouseEnter={()=>{roomHoverEnter(rooms[index])}} onMouseLeave={()=>{roomHoverLeave(rooms[index])}}>
                <div className="fill" id={rooms[index]+" fill"}>
                    <p className="pointer" onClick={()=>{roomButton(room_link)}}>Join Room<br/></p>
                    <p className="pointer" onClick={()=>{leaveRoom(rooms[index])}}>Leave Room</p>
                </div>
                <div id={rooms[index]+" info"}>
                    Room Name: {rooms[index]}<br/><br/>
                    Users:
                    <ul>
                        {roomUserBuilder(index)}
                    </ul>
                </div>
            </div>
        )
    }

    const displayUserRooms = ()=>{
        let room_array = []
        rooms.forEach((elem, index)=>{
            room_array.push(UserRoom(index))
        })
        return room_array
    }

    const roomHoverEnter = (id)=>{
        const fill = document.getElementById(id+" fill").style
        const info = document.getElementById(id+" info").style
        fill.transition="height 0.3s"
        info.height="0"
        info.color="transparent"
        fill.height="200px"
        fill.color="black"
    }

    const roomHoverLeave = (id)=>{
        const fill = document.getElementById(id+" fill").style
        const info = document.getElementById(id+" info").style
        fill.height="0"
        fill.color="transparent"
        fill.transition="none"
        info.height="200px"
        info.color="black"
    }

    const leaveRoom = (name)=>{
        const token = document.cookie.split("=")
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": token[1],
            },
            body: JSON.stringify({
                name:name,
                username:username,
            })
        }
        fetch('/api/delete-room', requestOptions).then((response)=>{
            if (response.ok){
                return response.json()
            }
            //do error
            return "error"
        }).then((data)=>{
            if (data !== "error"){
                let array = []
                rooms.forEach((element)=>{
                    if (element !== data.name){
                        array.push(element)
                    }
                })
                setRooms(array)
                document.getElementById(name).style.display="none"
            }
        })
    }

    const roomButton = (link)=>{
        props.history.push(link, {username: username, is_auth:true})
    }

    const logoutButton = ()=>{
        const token = document.cookie.split("=")
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": token[1],
            },
            body: JSON.stringify({
                username: username
            })
        }
        fetch('/api/user-logout', requestOptions).then((response)=>response.json()).then(()=>{
            props.history.push('/')
        })
    }

    const joinRoomButton = ()=>{
        const token = document.cookie.split("=")
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": token[1],
            },
            body: JSON.stringify({
                username: username,
                name: name,
            })
        }
        fetch('/api/user-rooms/link', requestOptions).then((response)=>{
            if (response.ok){
                return response.json()
            }
            setOpenError(true)
            document.body.addEventListener('click', ()=>{
                setOpenError(false)
            })
            setError(true)
            return "error"
        }).then((data)=>{
            if (data !== "error"){
                const link = '/chat-room/' + data.name
                props.history.push({
                    pathname: link,
                    state: {username:username, is_auth:true}
                })
            }
        })
    }

    return (
        <Grid container spacing={2}>
            <Grid item align="center" xs={12}>
                <Typography content="h4" variant="h4">
                    Welcome {username}
                </Typography>
            </Grid>
            <Grid item align="center" xs={12} id="room_container"> 
                {props.location.state !== undefined ? displayUserRooms(): ""}
            </Grid>
            <Grid item xs={12} align="center">
                <TextField error={error} variant="filled" label="room name" onChange={(e)=>{handleJoinRoomChange(e)}}/>
                <Button id="join_room" variant="contained" color="primary" onClick={joinRoomButton}>
                    Join Room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" to={{
                    pathname:'/create-room',
                    state: {username: username,is_auth:true}
                }} component={Link}>
                    Create Room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={logoutButton}>
                    Logout
                </Button>
            </Grid>
            <Grid item align="center" xs={12}>
                <Snackbar open={open_error}>
                    <Alert severity="error" id="error">Room name incorrect!</Alert>
                </Snackbar>
            </Grid>
        </Grid>
    )
}