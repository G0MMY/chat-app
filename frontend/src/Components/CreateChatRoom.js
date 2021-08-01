import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, TextField, Snackbar } from "@material-ui/core";
import {Link} from "react-router-dom";
import Alert from "./Alert";


export default function CreateChatRoom(props){
    const [roomName, setRoomName] = useState("")
    const [open_error, setOpenError] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (props.location.state === undefined || props.location.state.is_auth !== true){
            props.history.push('/')
        }
    },[])

    const handleRoomNameChange = (e)=>{
        setRoomName(e.target.value)
    }

    const createRoomButton = ()=>{
        if (roomName === ""){
            setError(true)
        } else {
            const token = document.cookie.split("=")
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "X-CSRFToken": token[1],
                },
                body: JSON.stringify({
                    name: roomName,
                })
            }
            fetch("/api/create-room", requestOptions).then((response)=>{
                if (response.ok){
                    return response.json()
                } 
                setError(true)
                setOpenError(true)
                document.body.addEventListener('click', ()=>{
                    setOpenError(false)
                })
                return "error"
            }).then((data)=>{
                if (data !== "error"){
                    const token = document.cookie.split("=")
                    const requestOptions = {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                            "X-CSRFToken": token[1],
                        },
                        body: JSON.stringify({
                            name: roomName,
                            username: props.location.state.username
                        })
                    }
                    fetch('/api/user-rooms/link', requestOptions).then((response)=>{
                        if (response.ok){
                            return response.json()
                        }
                        setError(true)
                        setOpenError(true)
                        document.body.addEventListener('click', ()=>{
                            setOpenError(false)
                        })
                        return "error"
                    }).then((data)=>{
                        if (data !== "error"){
                            props.history.push('/chat-room/' + roomName, {username:props.location.state.username, is_auth:true})
                        }
                    })
                }
            })
        }
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
                username: props.location.state.username,
            })
        }
        fetch('/api/user-logout', requestOptions).then((response)=>response.json()).then(()=>{
            props.history.push('/')
        })
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" content="h4">
                    Create a Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <TextField error={error} variant="filled" label="Room Name" onChange={(e)=>{handleRoomNameChange(e)}}/>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={createRoomButton}>
                    Create Room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" to={{
                    pathname: '/user-rooms',
                    state: {username:props.location.state !== undefined ? props.location.state.username : "", is_auth:true}
                }} component={Link}>
                    Back
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