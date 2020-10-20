import { BrowserRouter, Route, Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { adCurrentUser } from "./actions";

/* components */
import Groups from "./groups.js";
import GroupPage from "./groupspage.js";

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(adCurrentUser());
    }, []);

    return (
        <BrowserRouter>
            <Route exact path="/groups" render={() => <Groups />} />
            <Route exact path="/groups/:groupId" render={() => <GroupPage />} />
        </BrowserRouter>
    );
}
