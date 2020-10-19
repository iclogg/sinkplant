import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "./axios.js";
import { receiveGroups } from "./actions";

export default function Groups() {
    const dispatch = useDispatch();
    const groupsOffered = useSelector(
        (state) =>
            state.userGroupInfo &&
            state.userGroupInfo.filter((group) => group.accepted == false)
    );
    const groupsJoined = useSelector(
        (state) =>
            state.userGroupInfo &&
            state.userGroupInfo.filter((group) => group.accepted == true)
    );

    const groups = useSelector(
        (state) => state.currentUser && state.currentUser.memberships
    );

    let groupsNrs = [];

    console.log("groupsJoined, groupsOffered", groupsJoined, groupsOffered);

    useEffect(() => {
        if (groups) {
            for (let i = 0; i < groups.length; i++) {
                groupsNrs.push(groups[i].group_id);
            }
            dispatch(receiveGroups(groupsNrs));
        }
    }, [groups]);

    return (
        <div className="groups-page">
            <h1>Groups Page</h1>
            <h2>Your Groups</h2>
            <div className="groups-joined">
                {groupsJoined &&
                    groupsJoined.map((group) => {
                        return (
                            <div className="group" key={group.groups_id}>
                                <Link
                                    to={`/users/${group.groups_id}`}
                                    key={group.groups_id}
                                >
                                    <img
                                        className="medium list"
                                        src={group.profileurl}
                                    />
                                    <p>{group.groupname}</p>
                                </Link>
                                <div>
                                    <button
                                        onClick={() => {
                                            dispatch(
                                                endFriendship(group.groups_id)
                                            );
                                            dispatch(resetFriendRequests());
                                        }}
                                    >
                                        Join Group
                                    </button>
                                    <Link to={`/chat/${group.groups_id}`}>
                                        <button>Leave Group</button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
            </div>
            <h2>Your Invitations</h2>
            <div className="groups-offered">
                {groupsOffered &&
                    groupsOffered.map((group) => {
                        return (
                            <div
                                className={`group ${group.newRequest}`}
                                key={group.groups_id}
                            >
                                <Link to={`/users/${group.id}`}>
                                    <img
                                        className="medium list "
                                        src={group.profileurl}
                                    />
                                    <p>{group.groupname}</p>
                                </Link>
                                <button
                                    onClick={() => {
                                        dispatch(acceptFriendRequest(group.id));
                                        dispatch(resetFriendRequests());
                                    }}
                                >
                                    Accept Invitation
                                </button>
                                <button
                                    onClick={() => {
                                        dispatch(endFriendship(group.id));
                                    }}
                                >
                                    Reject Invitation
                                </button>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
