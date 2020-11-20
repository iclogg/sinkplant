import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./Welcome/Welcome";
import App from "./app.js";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";
import { init } from "./socket";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise)) // you could remove devtools when depoyed if you do not want people to see what is is state
);

let elem;

if (location.pathname == "/welcome") {
    console.log("in if in star.js");
    elem = <Welcome />;
} else {
    init(store);
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
