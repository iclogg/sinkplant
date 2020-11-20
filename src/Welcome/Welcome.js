// local styles
import css from "./welcome.module.css";

import React from "react";
import { HashRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Registration from "../registration.js";
import Login from "../login.js";
import Logo from "../components/Logo/Logo";

// import image from "../assets/sinkplant_icons/1.png";

export default function Welcome() {
    console.log("welcome.js");

    return (
        <div className={css.Wrapper} autoComplete="off">
            <HashRouter>
                <div className={css.Intro}>
                    <Logo css={css.LogoIntro} />
                    <ul>
                        <li className={css.Bath}>
                            <img
                                src="../../sinkplant_icons/1_white.png"
                                alt="icon"
                            ></img>
                        </li>
                        <li className={css.Kitchen}>
                            <img
                                src="../../sinkplant_icons/3_white.png"
                                alt="icon"
                            ></img>
                        </li>
                        <li className={css.Room}>
                            <img
                                src="../../sinkplant_icons/2_white.png"
                                alt="icon"
                            ></img>
                        </li>
                        <li className={css.Bed}>
                            <img
                                src="../../sinkplant_icons/4_white.png"
                                alt="icon"
                            ></img>
                        </li>
                    </ul>
                    <h1>
                        Living together
                        <br /> easier today
                    </h1>
                </div>

                <div className={css.Forms}>
                    <div className="logo">sinkplant</div>
                    <div className={css.Form}>
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
