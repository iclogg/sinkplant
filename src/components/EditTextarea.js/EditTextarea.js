import React, { useState } from "react";
import axios from "./axios";

const EditTextarea = ({
    path,
    children,
    width,
    height,
    fontSize,
    marginTop,
}) => {
    const [git, setText] = useState({});

    (async () => {
        try {
            const data = await axios.post(path, {
                userData,
            });
        } catch (err) {
            console.log("error in EditTextarea: ", err);
        }
    })();

    return (
        <textarea
            style={{
                width: width ? width : "300px",
                height: height || "auto",
                fontSize: fontSize || 8,
                marginTop: marginTop ? marginTop : "4em",
            }}
        >
            {children}
        </textarea>
    );
};

export default EditTextarea;
