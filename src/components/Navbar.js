import React from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout.js";

const Navbar = () => {
    return (
        <div className="navbar" style={{ width: "100%" }}>
            <h4>
                <Link to={"/"}>Your Groups</Link>
            </h4>
            <h4>
                <Link to={"/"}>Your Account</Link>
            </h4>
            <Link to={"/edit-profile"}>Edit Profile</Link>
            <Logout />
        </div>
    );
};
export default Navbar;
