// Styles
import css from "./Button.module.css";

import React from "react";

const Button = ({
    clicked,
    children,
    type,
    width,
    height,
    fontSize,
    marginTop,
}) => {
    return (
        <button
            className={[css.Btn, css[type]].join(" ")}
            style={{
                width: width ? width : "150px",
                height: height || "auto",
                fontSize: fontSize || 14,
                marginTop: marginTop ? marginTop : "4em",
            }}
            onClick={clicked}
        >
            {children}
        </button>
    );
};

export default Button;
