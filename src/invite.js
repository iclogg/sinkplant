import React, { useEffect, useRef, useState } from "react";
import { socket } from "./socket.js";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "./axios";

export default function Invite({ groupId }) {
    const [inviteEmail, setInviteEmail] = useState({});
    const handleChange = (e) => {
        setInviteEmail(e.target.value);
    };
    const submitInvite = () => {
        (async () => {
            try {
                const { data } = await axios.post("/api/sendInvite", {
                    inviteEmail,
                    groupId,
                });
            } catch (err) {
                console.log("err in submitInvite", err);
            }
        })(); // end async iffie
    };

    return (
        <div className="invite">
            <h3>Invite member</h3>
            <input
                name="pass"
                type="email"
                placeholder="email"
                onChange={(e) => handleChange(e)}
            />
            <button onClick={submitInvite}>Invite</button>
        </div>
    );
}
