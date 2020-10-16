import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";

ReactDOM.render(<HelloWorld />, document.querySelector("main"));

function HelloWorld() {
    return <div>Hello, World!</div>;
}
