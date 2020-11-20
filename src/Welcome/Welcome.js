// local styles
import css from "./welcome.module.css";

import React from "react";
import { HashRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Registration from "../registration.js";
import Login from "../login.js";

export default function Welcome() {
    console.log("welcome.js");

    return (
        <div className={css.WelcomeWrapper} autoComplete="off">
            <HashRouter>
                <div className="welcome-intro">
                    <h1>
                        Living together
                        <br /> easier today
                    </h1>
                </div>
                <div className="welcome-forms">
                    <div className="logo">sinkplant</div>
                    <div className="forms">
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                    </div>
                    <div className="github">
                        <p>owner</p>
                        <p>contributor</p>
                    </div>
                </div>
            </HashRouter>
        </div>
    );
}
