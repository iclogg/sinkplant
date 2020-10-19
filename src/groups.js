import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* import {
    
} from "./actions"; */

export default function Groups() {
    const dispatch = useDispatch();
    const groupsOffered = useSelector(
        (state) =>
            state.currentUser &&
            state.currentUser.memberships.filter(
                (group) => group.accepted == false
            )
    );
    const groupsJoined = useSelector(
        (state) =>
            state.currentUser &&
            state.currentUser.memberships.filter(
                (group) => group.accepted == true
            )
    );

    console.log("groupsJoined, groupsOffered", groupsJoined, groupsOffered);

    useEffect(() => {
        // dispatch(receiveGroups());
    });

    return (
        <div className="groups-page">
            <h1>Groups Page</h1>
        </div>
    );
}
