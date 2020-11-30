// Styles
import css from "./RegistrationLogin.module.css";

// Components
import Button from "./components/Button/Button";

import React, { useState } from "react";
import axios from "./axios";
import { HashRouter, Link } from "react-router-dom";

export default function Registration() {
    const [userData, setUserData] = useState({});

    let error = false;

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const submitUserData = () => {
        console.log("in the async iffie");
        (async () => {
            console.log("in the async iffie");
            try {
                const { data } = await axios.post("/api/register", {
                    userData,
                });
                console.log("registered the new user");
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
                name="username"
                type="text"
                placeholder="Username"
                onChange={(e) => handleChange(e)}
            />

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
            <Button clicked={submitUserData} type={"Normal"} fontSize={16}>
                Register
            </Button>
            <HashRouter>
                <p className={css.Linkbox} id="one">
                    Already signed up?&nbsp;&nbsp;
                    <Link to="/login" className="link">
                        Login
                    </Link>
                </p>
            </HashRouter>
        </div>
    );
}
