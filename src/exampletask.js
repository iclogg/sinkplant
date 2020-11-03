import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logout from "./logout.js";

export default function ExampleTask({}) {
    // console.log(taskthere);

    return (
        <div className="task">
            <h4 className="tasktitle">Example&nbsp;&nbsp;</h4>
            <i className="fas fa-trash-alt"></i>
            <p className="task-input"></p>
            <p className="task-input"></p>
            <p className="task-input"></p>
            <p className="task-input"></p>
            <p className="task-input"></p>
            <p className="task-input"></p>
            <p className="task-input"></p>
            <p className="task-input"></p>
        </div>
    );
}
