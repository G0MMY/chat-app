import React from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";

export default function App(){
    return (
        <>
            <HomePage/>
        </>
    )
}

render(
    <App/>,
    document.getElementById("app")
)