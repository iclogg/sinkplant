import axios from "./axios.js";
import { BrowserRouter, Route, Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { adCurrentUser } from "./actions";

/* components */
import Groups from "./groups.js";

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("/api/user");
                console.log("App -> data", data);
                dispatch(adCurrentUser(data));
            } catch (err) {
                console.log(err);
            }
        })(); // end async iffie
    }, []);

    return (
        <BrowserRouter>
            <h1>You are logged in</h1>
            <Route exact path="/groups" render={() => <Groups />} />
        </BrowserRouter>
    );
}
