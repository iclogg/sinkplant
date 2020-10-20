import React, { useEffect, useState, useRef } from "react";
import { socket } from "./socket.js";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getGroup, getMembers } from "./functions.js";

/* components */
import Invite from "./invite.js";
import TaskPage from "./taskpage.js";

export default function GroupPage() {
    const [group, setGroup] = useState({});
    const [members, setMembers] = useState([]);
    const [taskView, setTaskView] = useState(null);
    const groupId = Number(window.location.pathname.slice(8));

    useEffect(() => {
        (async () => {
            setGroup(await getGroup(groupId));
            setMembers(await getMembers(groupId));
        })(); // end async iffie
    }, []);

    return (
        <div className="grouppage">
            <h1>This Group Is {group.groupname} </h1>
            <p>{group.groupbio}</p>
            <Invite groupId={groupId} />
            <h3>Members</h3>

            <div className="groups-joined">
                {members &&
                    members.map((member) => {
                        return (
                            <div className="group" key={member.user_id}>
                                <p>{member.username}</p>
                            </div>
                        );
                    })}
            </div>
            <h3>Tasks</h3>

            <div className="groups-joined">
                {group.tasks &&
                    group.tasks.map((task) => {
                        return (
                            <div
                                className="task"
                                key={task.id}
                                onClick={() => setTaskView(task.id)}
                            >
                                <p>{task.title}</p>
                            </div>
                        );
                    })}
            </div>
            {taskView && (
                <TaskPage
                    taskArr={group.tasks.filter((task) => task.id == taskView)}
                />
            )}

            <div onClick={() => setTaskView(null)}>
                {/* OBS!!!! add logic to get tasks from database againg on this click */}
                <p>clear task view </p>
            </div>
        </div>
    );
}

/* state.onlineUsers.filter(
                (user) => user.id != action.removeId
            ) */

{
    /* <ProfilePick
    firstname={this.state.firstname}
    lastname={this.state.lastname}
    id={this.state.id}
    profileurl={this.state.profileurl}
    toggleUpploader={this.toggleUpploader}
    myClassName="small"
/>;
 */
}
