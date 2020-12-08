import React, { Fragment } from "react";

// Components
import Navbar from "../Navbar.js";
import Menu from "../Menu/Menu.js";
import Footer from "../Footer.js";

const Layout = (props) => {
    return (
        <span style={{ display: "flex" }}>
            <Menu />
            <div style={{ width: "calc(100vw-600px)", height: "100vh" }}>
                <Navbar />
                <main>{props.children}</main>
                <Footer />
            </div>
        </span>
    );
};

export default Layout;
