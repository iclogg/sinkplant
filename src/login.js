// Styles
import css from "./RegistrationLogin.module.css";

// Components
import Button from "./components/Button/Button";

import React, { useState } from "react";
import axios from "./axios";
import { HashRouter } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
    let error = false;
    const [userData, setUserData] = useState({});

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const submitLogin = () => {
        (async () => {
            console.log("in the async iffie");
            try {
                const { data } = await axios.post("/api/login", {
                    userData,
                });
                console.log("logged in user");
                if (data.succsess) {
                    location.replace("/");
                } else {
                    error = true;
                }
            } catch (err) {
                console.log("err in submitUserData", err);
            }
        })(); // end async iffie
    };

    return (
        <div className={css.RegistrationLogin}>
            {error && (
                <div className="error">
                    Ops, something went wrong. Please check you have filled all
                    fields with valid information
                </div>
            )}
            <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={(e) => handleChange(e)}
            />
            <input
                name="pass"
                type="password"
                placeholder="Password"
                onChange={(e) => handleChange(e)}
            />
            <Button
                id="login"
                clicked={submitLogin}
                type={"Normal"}
                fontSize={16}
            >
                Login
            </Button>

            <p className={css.Linkbox} id="two">
                New to SinkPlant?&nbsp;&nbsp;
                <HashRouter>
                    <Link to="/" className="link">
                        Register
                    </Link>
                </HashRouter>
            </p>
        </div>
    );
}
