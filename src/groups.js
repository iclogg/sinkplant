import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "./axios.js";
import {
    receiveGroups,
    acceptGroupInvite,
    leaveGroup,
    adCurrentUser,
    adGroup,
} from "./actions";

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
    const [userData, setUserData] = useState({});

    let groupsNrs = [];

    // console.log("groupsJoined, groupsOffered", groupsJoined, groupsOffered);

    useEffect(() => {
        if (groups) {
            for (let i = 0; i < groups.length; i++) {
                groupsNrs.push(groups[i].group_id);
            }
            dispatch(receiveGroups(groupsNrs));
        }
    }, [groups]);

    useEffect(() => {
        return () => {
            dispatch(adCurrentUser());
        };
    }, []);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleNewGroup = async () => {
        const { name, groupDescription } = userData;
        dispatch(adGroup(name, groupDescription));
        setUserData({
            name: "",
            groupDescription: "",
        });
    };

    return (
        <div className="groups-page">
            <div className="groups-joined">
                <h2>Your Groups</h2>
                {groupsJoined &&
                    groupsJoined.map((group) => {
                        return (
                            <div className="group" key={group.groups_id}>
                                <Link
                                    to={`/groups/${group.groups_id}`}
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
                                                leaveGroup(group.groups_id)
                                            );
                                        }}
                                    >
                                        Leave Group
                                    </button>

                                    {/* nice to have group chat:  <Link to={`/chat/${group.groups_id}`}>
                                        <button>Leave Group</button>
                                    </Link> */}
                                </div>
                            </div>
                        );
                    })}
            </div>
            <div className="adgroup">
                <h2>Create a group</h2>
                <input
                    name="name"
                    type="text"
                    placeholder="Group Name"
                    onChange={(e) => handleChange(e)}
                    value={userData.name}
                />

                <input
                    name="groupDescription"
                    type="text"
                    placeholder="A short description of group"
                    onChange={(e) => handleChange(e)}
                    value={userData.groupDescription}
                />
                <button id="create" onClick={handleNewGroup}>
                    Create Group
                </button>
            </div>
            <div className="groups-offered">
                <h2>Your Invitations</h2>
                {groupsOffered &&
                    groupsOffered.map((group) => {
                        return (
                            <div
                                className={`group ${group.newRequest}`}
                                key={group.groups_id}
                            >
                                <img
                                    className="medium list "
                                    src={group.profileurl}
                                />
                                <p>{group.groupname}</p>

                                <button
                                    onClick={() => {
                                        dispatch(
                                            acceptGroupInvite(group.groups_id)
                                        );
                                    }}
                                >
                                    Join Group
                                </button>
                                <button
                                    onClick={() => {
                                        dispatch(leaveGroup(group.groups_id));
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
