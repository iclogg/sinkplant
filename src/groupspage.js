import React, { useEffect, useState, useRef } from "react";
import { socket } from "./socket.js";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getGroup, getMembers } from "./functions.js";

/* components */
import Invite from "./invite.js";
import TaskPage from "./taskpage.js";
import { markDone, adTask, deleteTask } from "./functions.js";

export default function GroupPage() {
    const [group, setGroup] = useState({});
    const [members, setMembers] = useState([]);
    const [taskView, setTaskView] = useState(null);
    const [userData, setUserData] = useState({
        title: "",
        taskDescription: "",
    });

    const groupId = Number(window.location.pathname.slice(8));

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };
    useEffect(() => {
        (async () => {
            setGroup(await getGroup(groupId));
            setMembers(await getMembers(groupId));
        })(); // end async iffie
        console.log("useeffect GroupPage");
    }, [setTaskView]);

    const handleNewTask = () => {
        (async () => {
            const { title, taskDescription } = userData;
            const newTask = await adTask(taskDescription, groupId, title);
            console.log("handleNewTask -> newTask", newTask);
            setGroup({ ...group, tasks: [...group.tasks, newTask] });
            setUserData({
                title: "",
                taskDescription: "",
            });
        })(); // end async iffie
    };

    const handleDeleteTask = (task_id) => {
        (async () => {
            await deleteTask(task_id);
            console.log("task_id delete", task_id);

            // setGroup({ ...group, tasks: [...group.tasks, newTask] });
        })(); // end async iffie
    };

    return (
        <div className="grouppage">
            <h1>This Group Is {group.groupname} </h1>
            <p>{group.groupbio}</p>
            <Invite groupId={groupId} />
            <h3>Members</h3>

            <div className="members">
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

            <div className="tasks">
                {group.tasks &&
                    group.tasks.map((task) => {
                        return (
                            <div
                                className="task"
                                key={task.id}
                                onClick={() => setTaskView(task.id)}
                            >
                                <p className="sub">{task.title} </p>
                                <i
                                    className="fas fa-trash-alt"
                                    onClick={() => handleDeleteTask(task.id)}
                                ></i>
                            </div>
                        );
                    })}
            </div>
            {taskView && (
                <TaskPage
                    taskArr={group.tasks.filter((task) => task.id == taskView)}
                />
            )}

            <div
                onClick={() => {
                    setTaskView(null);
                    (async () => {
                        setGroup(await getGroup(groupId));
                        setMembers(await getMembers(groupId));
                    })();
                }}
            >
                {/* OBS!!!! add logic to get tasks from database againg on this click */}
                <p>clear task view </p>
            </div>
            <div className="adtask">
                <h5>Ad Group Task</h5>
                <input
                    name="title"
                    type="text"
                    placeholder="title"
                    onChange={(e) => handleChange(e)}
                    value={userData.title}
                />

                <input
                    name="taskDescription"
                    type="text"
                    placeholder="Description of task"
                    onChange={(e) => handleChange(e)}
                    value={userData.taskDescription}
                />

                <button onClick={handleNewTask}>Add Task</button>
            </div>
        </div>
    );
}
