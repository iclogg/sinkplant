import { BrowserRouter, Route } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { adCurrentUser } from "./actions";

/* components */
import Groups from "./groups.js";
import GroupPage from "./groupspage.js";
import Layout from "./components/Layout/Layout";

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(adCurrentUser());
    }, []);

    return (
        <div className="app">
            <BrowserRouter>
                <Layout>
                    <Route exact path="/" render={() => <Groups />} />
                    <Route
                        exact
                        path="/groups/:groupId"
                        render={() => <GroupPage />}
                    />
                </Layout>
            </BrowserRouter>
        </div>
    );
}
