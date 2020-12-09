import React from "react";
import axios from "../axios";

export default function Logout() {
    const logout = () => {
        (async () => {
            try {
                await axios.get(`/api/logout/`);
                location.pathname = "/welcome";
            } catch (err) {
                console.log(err);
            }
        })(); // end async iffie
    };

    return (
        <h4 className="clickable" onClick={logout}>
            Logout
        </h4>
    );
}
