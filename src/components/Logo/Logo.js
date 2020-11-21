import React from "react";

/* ---> preferred way of working with images but the current webpack config does not support it
import sinkplantLogo from "../../../public/Logo_green.png";
*/

/* --- props Logo component takes ---
1. text: true / false   -> determines whether the Logo displays the text
2. icon: true / false   -> if 
3. width: number        -> width of the div which contains the image
4. fontSize:            -> font size of text if displayed
*/

const Logo = ({ text, icon, width, fontSize }) => {
    const styleLeaf = {
        width: width,
    };
    const styleText = {
        color: "#009315",
        fontSize: fontSize,
        marginRight: "-12px",
    };

    return (
        <div style={{ display: "flex", alignItems: "baseline" }}>
            {text && <p style={styleText}>sinkplan{!icon && "t"}</p>}
            {icon && (
                <div style={styleLeaf}>
                    <img
                        src="../../../sinkplant_icons/Logo_green.png"
                        alt="logo"
                        style={{
                            width: "100%",
                            objectFit: "contain",
                        }}
                    ></img>
                </div>
            )}
        </div>
    );
};

export default Logo;
