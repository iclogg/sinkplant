import { BrowserRouter, Route, Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { adCurrentUser } from "./actions";

/* components */
import Groups from "./groups.js";
import GroupPage from "./groupspage.js";
import Navbar from "./navbar.js";

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(adCurrentUser());
    }, []);

    return (
        <div className="app">
            <BrowserRouter>
                <Navbar />
                <Route exact path="/" render={() => <Groups />} />
                <Route
                    exact
                    path="/groups/:groupId"
                    render={() => <GroupPage />}
                />
            </BrowserRouter>
        </div>
    );
}
