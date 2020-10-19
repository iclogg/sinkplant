import React from "react";
import { HashRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Registration from "./registration.js";
import Login from "./login.js";

export default function Welcome() {
    console.log("welcome.js");

    return (
        <div className="welcome" autoComplete="off">
            <h1>🌱 Welcome to SinkPlant 🌱</h1>
            <p>For living together easier today. </p>
            <HashRouter>
                <>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </>
            </HashRouter>
        </div>
    );
}
