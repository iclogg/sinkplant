// local styles
import css from "./welcome.module.css";

import React from "react";
import { HashRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Registration from "../registration.js";
import Login from "../login.js";
import Logo from "../components/Logo/Logo";
import { FaGithub } from "react-icons/fa";
import useViewport from "../helpers/useViewport";

// import image from "../assets/sinkplant_icons/1.png";

export default function Welcome() {
    console.log("welcome.js");

    const { width } = useViewport();
    console.log(width);
    const breakpoint = 599;

    const mobile = breakpoint > width;
    console.log(mobile);

    return (
        <div className={css.Wrapper} autoComplete="off">
            <HashRouter>
                <div className={css.IntroArea}>
                    <div className={css.LogoIntro}>
                        <Logo
                            width={mobile ? 230 : 80}
                            text={false}
                            icon={true}
                        />
                    </div>
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

                <div className={css.FormsArea}>
                    <div className={css.LogoWelcome}>
                        <Logo
                            width={mobile ? 40 : 55}
                            text={true}
                            icon={true}
                            fontSize={mobile ? 30 : 40}
                        />
                    </div>

                    <div className={css.Form}>
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                    </div>
                    <div className={css.Github}>
                        <a
                            href="https://github.com/iclogg"
                            target="_blank"
                            rel="noreferrer"
                            id={css.Owner}
                        >
                            <FaGithub className={css.GitIcon} />
                            <br />
                            owner
                        </a>
                        <a
                            href="https://github.com/ioanatatu"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FaGithub className={css.GitIcon} />
                            <br />
                            contributor
                        </a>
                    </div>
                </div>
            </HashRouter>
        </div>
    );
}
