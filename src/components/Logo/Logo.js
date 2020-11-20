import React from "react";
import css from "./Logo.module.css";

// import sinkplantLogo from "../../../public/Logo_green.png";

const Logo = (props) => {
    return (
        <div className={`${props.css} ${css.Logo}`}>
            <img src="../../../sinkplant_icons/Logo_green.png" alt="logo"></img>
        </div>
    );
};

export default Logo;
