import React, { useEffect, useState, useRef } from "react";
import { socket } from "./socket.js";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getGroup, getMembers, getCurrentWeeks } from "./functions.js";

/* components */
import Invite from "./invite.js";
import TaskPage from "./taskpage.js";
import { markDone, adTask, deleteTask } from "./functions.js";

export default function GroupPage() {
    const [group, setGroup] = useState({});
    const [members, setMembers] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [taskView, setTaskView] = useState(null);
    const [userData, setUserData] = useState({
        title: "",
        taskDescription: "",
    });
    const [doneTasks, setdoneTasks] = useState({});

    const groupId = Number(window.location.pathname.slice(8));

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };
    useEffect(() => {
        (async () => {
            setGroup(await getGroup(groupId));
            setMembers(await getMembers(groupId));
            setAssignments(await getCurrentWeeks(groupId));
            console.log(assignments);
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
            setGroup({
                ...group,
                tasks: group.tasks.filter((task) => task.id != task_id),
            });
        })(); // end async iffie
    };

    const toggleTastView = () => {
        setTaskView(null);
        (async () => {
            setGroup(await getGroup(groupId));
            setMembers(await getMembers(groupId));
        })();
    };

    const checkAllDone = (task_id) => {
        for (let i = 0; i < group.tasks.length; i++) {
            if (group.tasks[i].id == task_id) {
                if (group.tasks[i].subtasks) {
                    for (let j = 0; j < group.tasks[i].subtasks.length; j++) {
                        if (!group.tasks[i].subtasks[j].done) {
                            return "task-input notdone";
                        }
                    }
                }
            }
        }

        return "task-input alldone";
    };

    const checkIfAssigned = (taskid, week) => {
        for (let i = 0; i < assignments.length; i++) {
            /*    console.log("assignments[i].week", assignments[i].week);
            console.log("assignments[i].week++", assignments[i].week--);
            console.log("assignments[i].week++", assignments[i].week--); */

            if (
                week == "now" &&
                assignments[i].this_week == assignments[i].week
            ) {
                if (assignments[i].task_id == taskid) {
                    for (let j = 0; j < members.length; j++) {
                        if (assignments[i].user_id == members[j].user_id) {
                            return members[j].username;
                        }
                    }
                }
            } else if (
                week == "last" &&
                assignments[i].this_week == assignments[i].week - 1
            ) {
                if (assignments[i].task_id == taskid) {
                    for (let j = 0; j < members.length; j++) {
                        if (assignments[i].user_id == members[j].user_id) {
                            return members[j].username;
                        }
                    }
                }
            } else if (
                week == "next" &&
                assignments[i].this_week == assignments[i].week + 1
            ) {
                if (assignments[i].task_id == taskid) {
                    for (let j = 0; j < members.length; j++) {
                        if (assignments[i].user_id == members[j].user_id) {
                            return members[j].username;
                        }
                    }
                }
            }
        }
    };

    return (
        <div className="grouppage">
            <h1> {group.groupname} </h1>
            <p>{group.groupbio}</p>
            <Invite groupId={groupId} />
            <h3>Members of the Household:</h3>

            <div className="members">
                {members &&
                    members.map((member) => {
                        return (
                            <div className="member" key={member.user_id}>
                                <p>{member.username}</p>
                            </div>
                        );
                    })}
            </div>
            <h3>Tasks</h3>

            <div className="tasks">
                <div className="weeks">
                    <p>Last Week </p>
                    <p>This Week </p>
                    <p>Next Week </p>
                </div>
                {group.tasks &&
                    group.tasks.map((task) => {
                        return (
                            <div className="task" key={task.id}>
                                <p
                                    className="sub"
                                    onClick={() => setTaskView(task.id)}
                                >
                                    {task.title}&nbsp;&nbsp;
                                </p>
                                <i
                                    className="fas fa-trash-alt"
                                    onClick={() => handleDeleteTask(task.id)}
                                ></i>
                                <input
                                    className="task-input"
                                    list="names"
                                    type="option"
                                    name="last"
                                    value={checkIfAssigned(task.id, "last")}
                                />
                                <input
                                    className={checkAllDone(task.id)}
                                    list="names"
                                    type="option"
                                    name="now"
                                    value={checkIfAssigned(task.id, "now")}
                                />
                                <input
                                    className="task-input"
                                    list="names"
                                    type="option"
                                    name="next"
                                    value={checkIfAssigned(task.id, "next")}
                                />
                                <datalist id="names">
                                    {members &&
                                        members.map((member) => {
                                            return (
                                                <option
                                                    value={member.username}
                                                    key={member.user_id}
                                                />
                                            );
                                        })}
                                </datalist>
                            </div>
                        );
                    })}
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
            {taskView && (
                <TaskPage
                    taskArr={group.tasks.filter((task) => task.id == taskView)}
                    toggleTastView={toggleTastView}
                />
            )}
        </div>
    );
}
