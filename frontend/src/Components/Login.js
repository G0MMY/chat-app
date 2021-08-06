import React, { useState } from "react";
import { Grid, Button, Typography, TextField, Snackbar } from "@material-ui/core";
import Alert from "./Alert";


export default function Login(props){
    const [user, setUser] = useState({
        username: "",
        password: "",
    })
    const [username_valid, setUsernameValid] = useState(false)
    const [password_valid, setPasswordValid] = useState(false)
    const [open_error, setOpenError] = useState(false)

    const handleUsernameChange = (e)=>{
        setUser({
            username: e.target.value,
            password: user.password,
        })
    }

    const handlePasswordChange = (e)=>{
        setUser({
            password: e.target.value,
            username: user.username,
        })
    }

    const loginButton = ()=>{
        if (user.username === ""){
            setUsernameValid(true)
        } else if (user.password === ""){
            setPasswordValid(true)
        } else {
            const token = document.cookie.split("=")
            const requestOptions = {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "X-CSRFToken": token[1]
                },
                body: JSON.stringify({
                    username: user.username,
                    password: user.password,
                })
            }
            fetch('/api/user-auth', requestOptions).then((response)=>{
                if (response.ok){
                    return response.json()
                } 
                setOpenError(true)
                document.body.addEventListener('click', ()=>{
                    setOpenError(false)
                })
                return "error"
            }).then((data)=>{
                if (data !== "error"){ 
                    props.history.push('/user-rooms', {username: user.username, is_auth: true})     
                }
            })
        }
    }
    
    return (
        <Grid container spacing={2}>
            <Grid item align="center" xs={12}>
                <Typography variant="h2" content="h2">
                    Chat App 
                </Typography>
            </Grid>
            <Grid item align="center" xs={12}>
                <Typography variant="h4" content="h4">
                    Login: 
                </Typography>
            </Grid>
            <Grid item align="center" xs={12}>
                <TextField error={username_valid} variant="filled" label="username" onChange={(e)=>{handleUsernameChange(e)}}/>
            </Grid>
            <Grid item align="center" xs={12}>
                <TextField error={password_valid} variant="filled" label="password" type="password" onChange={(e)=>{handlePasswordChange(e)}}/>
            </Grid>
            <Grid item align="center" xs={12}>
                <Button color="primary" variant="contained" onClick={loginButton}>
                    Login
                </Button>
            </Grid>
            <Grid item align="center" xs={12}>
                <Button color="default" variant="contained" onClick={()=>{props.history.push('/create-user')}}>
                    Create New User
                </Button>
            </Grid>
            <Grid item align="center" xs={12}>
                <Snackbar open={open_error}>
                    <Alert severity="error" id="error">Username or password incorrect!</Alert>
                </Snackbar>
            </Grid>
        </Grid>
    )
}
