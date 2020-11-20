import React, { useState } from "react";
import axios from "./axios";

export default function Invite({ groupId }) {
    const [inviteEmail, setInviteEmail] = useState("");
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
                setInviteEmail("");
            } catch (err) {
                console.log("err in submitInvite", err);
            }
        })(); // end async iffie
    };

    return (
        <div className="invite">
            <h5>Invite a new member</h5>
            <input
                name="pass"
                type="email"
                placeholder="email"
                onChange={(e) => handleChange(e)}
                value={inviteEmail}
            />
            <button onClick={submitInvite}>Invite</button>
        </div>
    );
}
