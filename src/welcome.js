import React from "react";
import { HashRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Registration from "./registration.js";
import Login from "./login.js";

export default function Welcome() {
    console.log("welcome.js");

    return (
        <div className="welcome clickable" autoComplete="off">
            <HashRouter>
                <div className="welcome-box">
                    <h1> Welcome to SinkPlant </h1>
                    <p> 🌱 Living together easier today. </p>
                    <div />
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
