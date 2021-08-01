import React, { useState, useEffect, useRef } from "react";
import { Grid, Button, Typography, Paper, TextField, Chip } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

export default function ChatRoom(props){
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState("")
    const [counter, setCounter] = useState(0)
    const chatSocket = useRef(null)

    useEffect(()=>{
        let message_container = document.getElementById("message_container")
        message_container.scrollTop = message_container.scrollHeight
    })

    useEffect(() => {
        if (props.location.state !== undefined && props.location.state.is_auth === true){
            chatSocket.current = new WebSocket(
                'ws://'
                + window.location.host
                + '/ws/chat-room/'
                + props.match.params.name
                + '/'
            )
            fetch('/api/room-messages').then((response)=>response.json()).then((data)=>{
                let messages_array = []
                let count = 0
                data.forEach((element) => {
                    if (element.name === props.match.params.name){
                        messages_array.push(messageBuilder(element.message, element.username, count, element.created_at))
                        count += 1
                    }
                })
                setMessages(messages_array)
                setCounter(count)
            })
            chatSocket.current.onmessage = function() {
                fetch('/api/room-messages').then((response)=>response.json()).then((data)=>{
                    let messages_array = []
                    let count = 0
                    data.forEach((element) => {
                        if (element.name === props.match.params.name){
                            messages_array.push(messageBuilder(element.message, element.username, count, element.created_at))
                            count += 1
                        }
                    })
                    setMessages(messages_array)
                    setCounter(count)
                })
            }
        } else {
            props.history.push('/')
        }
    }, [])

    const handleMessageChange = (e)=>{
        setMessage(e.target.value)
    }

    const formatDate = (date)=>{
        let result = ""
        let array = date.split("T")
        result += array[0] + " "
        array = array[1].split(".")
        result += array[0]

        return result
    }

    const messageBuilder = (message, username, index, date)=>{
        const send_date = formatDate(date)
        //there is a better way to do this
        let right = ""
        if (username !== props.location.state.username){
            right="_right"
        }
        const class_old = "old_message_container" + right
        const class_label = "username_label" + right
        const class_message = "old_message" + right
        const delete_message = "delete_message" + right
        const class_date = "date" + right

        if (username === props.location.state.username){
            return(
                <div className={class_old} id={index}>
                    <p className={class_label}>{username}</p>
                    <div className={class_message}>
                        {message}
                    </div>
                    <RemoveCircleIcon className={delete_message} onClick={()=>{deleteMessage(index, message, username, date)}}/>
                    <p className={class_date}>{send_date}</p>
                </div>
            )
        } else {
            return(
                <div className={class_old} id={index}>
                    <p className={class_label}>{username}</p>
                    <div className={class_message}>
                        {message}
                    </div>
                    <p className={class_date}>{send_date}</p>
                </div>
            )
        }
    }

    const deleteMessage = (id, message, username, date)=>{
        const token = document.cookie.split("=")
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": token[1],
            },
            body: JSON.stringify({
                username:username,
                name: props.match.params.name,
                created_at: date,
                message: message,
            })
        }
        fetch('/api/delete-message', requestOptions).then((response)=>{
            if (response.ok){
                return response.json()
            }
            return "error"
        }).then((data)=>{
            if (data !== "error"){
                document.getElementById(id).style.display = "none"
            }
        })
    }

    const messageButton = ()=>{
        const token = document.cookie.split("=")
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": token[1],
            },
            body: JSON.stringify({
                name: props.match.params.name,
                message: message,
                username: props.location.state.username,
            })
        }
        fetch('/api/create-message', requestOptions).then((response)=>response.json()).then((data)=>{
            chatSocket.current.send(JSON.stringify({
                'message': data.message,
                'username': data.username,
                'created_at': data.created_at,
            }));
        })
        document.getElementById("message").value=""
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

    const backButton = ()=>{
        chatSocket.current.close(1000)
        props.history.push('/user-rooms', {username:props.location.state.username, is_auth:true})
    }

    return(
        <Grid container spacing={2}>
            <Grid item align="center" xs={12}>
                <Typography variant="h2" content="h2">
                    Room Name: {props.match.params.name}
                </Typography>
            </Grid>
            <Grid item align="center" xs={11}>
                <Paper elevation={3} id="chat">
                    <div id="message_container">
                        {messages}
                    </div>
                    <TextField id="message" variant="outlined" multiline={true} onChange={(e)=>{handleMessageChange(e)}}/>
                    <Button variant="contained" color="primary" id="send_message" onClick={()=>{messageButton()}}>
                        Send &nbsp;<SendIcon/>
                    </Button>
                </Paper>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={()=>{
                    backButton()
                }}>
                    Go to your rooms
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={logoutButton}>
                    Logout
                </Button>
            </Grid>
        </Grid>
    )
}

