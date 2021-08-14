import React, { useState } from "react";
import { Grid, Button, Typography, TextField, Snackbar } from "@material-ui/core";
import { Link } from "react-router-dom";
import Alert from "./Alert";

export default function CreateUser(props){
    const [user, setUser] = useState({
        username: "",
        password: "",
        email: "",
    })
    const [open_error, setOpenError] = useState(false)
    const [error , setError] = useState({
        username: false,
        password: false,
        email: false
    })

    const handleEmailChange = (e)=>{
        setUser({
            email: e.target.value,
            password: user.password,
            username: user.username,
        })
    }

    const handleUsernameChange = (e)=>{
        setUser({
            username: e.target.value,
            password: user.password,
            email: user.email,
        })
    }

    const handlePasswordChange = (e)=>{
        setUser({
            password: e.target.value,
            username: user.username,
            email: user.email,
        })
    }

    const createUserButton = ()=>{
        if (user.username === ""){
            setError({
                username: true,
                passowrd: false,
                email: false,
            })
        } else if (user.password === ""){
            setError({
                username: false,
                password: true,
                email: false,
            })
        } else if (user.email === ""){
            setError({
                username: false,
                password: false,
                email: true,
            })
        } else {
            const token = document.cookie.split("=")
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "X-CSRFToken": token[1],
                },
                body: JSON.stringify({
                    username: user.username,
                    password: user.password,
                    email: user.email
                })
            }
            fetch('/api/create-user', requestOptions).then((response)=>{
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
                    Create User
                </Typography>
            </Grid>
            <Grid item align="center" xs={12}>
                <TextField error={error.username} variant="filled" label="username" onChange={(e)=>{handleUsernameChange(e)}}/>
            </Grid>
            <Grid item align="center" xs={12}>
                <TextField error={error.password} variant="filled" label="password" type="password" onChange={(e)=>{handlePasswordChange(e)}}/>
            </Grid>
            <Grid item align="center" xs={12}>
                <TextField error={error.email} variant="filled" label="email" onChange={(e)=>{handleEmailChange(e)}}/>
            </Grid> 
            <Grid item align="center" xs={12}>
                <Button color="primary" variant="contained" onClick={createUserButton}>
                    Create User
                </Button>
            </Grid>
            <Grid item align="center" xs={12}>
                <Button color="secondary" variant="contained" to='/' component={Link}>
                    Back
                </Button>
            </Grid>
            <Grid item align="center" xs={12}>
                <Snackbar open={open_error}>
                    <Alert severity="error" id="error">Username, password or email invalid!</Alert>
                </Snackbar>
            </Grid>
        </Grid>
    )
}