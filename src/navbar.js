import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriends } from "./actions";
import { Link } from "react-router-dom";
import Logout from "./logout.js";

export default function Navbar() {
    return (
        <div className="navbar">
            <h1>🌱</h1>

            <h4>
                <Link to={"/"}>Your Groups</Link>
            </h4>
            <h4>
                <Link to={"/"}>Your Account</Link>
            </h4>
            <Logout />
        </div>
    );
}
