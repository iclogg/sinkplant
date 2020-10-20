import React, { useEffect, useState, useRef } from "react";
import { socket } from "./socket.js";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* components */
import Invite from "./invite.js";
import { getGroup } from "./functions.js";

export default function GroupPage() {
    const [group, setGroup] = useState({});
    const [members, setMembers] = useState({});
    const groupId = Number(window.location.pathname.slice(8));

    useEffect(() => {
        (async () => {
            setGroup(await getGroup(groupId));
        })(); // end async iffie
    }, []);

    return (
        <div className="grouppage">
            <h1>This Group Is {group.groupname} </h1>
            <Invite groupId={groupId} />
        </div>
    );
}
