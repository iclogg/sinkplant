import React, { useEffect, useState, useRef } from "react";
import { socket } from "./socket.js";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    getGroup,
    getMembers,
    getCurrentWeeks,
    assignTask,
} from "./functions.js";

/* components */
import Invite from "./invite.js";
import TaskPage from "./taskpage.js";
import {
    markDone,
    adTask,
    deleteTask,
    repeatGroupAssignment,
} from "./functions.js";

export default function GroupPage() {
    const [, forceUpdate] = useState();
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
        })(); // end async iffie
    }, [setTaskView]);

    /* useEffect(() => {
        console.log("assignments has been updated");
        // setTimeout(forceUpdate, 2000);
    }, [assignments]); */

    const handleNewTask = () => {
        (async () => {
            const { title, taskDescription } = userData;
            const newTask = await adTask(taskDescription, groupId, title);
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
                assignments[i].this_week - 1 == assignments[i].week
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
                assignments[i].this_week + 1 == assignments[i].week
            ) {
                if (assignments[i].task_id == taskid) {
                    for (let j = 0; j < members.length; j++) {
                        if (assignments[i].user_id == members[j].user_id) {
                            return members[j].username;
                        }
                    }
                }
            } else if (
                week == "nextnext" &&
                assignments[i].this_week + 2 == assignments[i].week
            ) {
                if (assignments[i].task_id == taskid) {
                    for (let j = 0; j < members.length; j++) {
                        if (assignments[i].user_id == members[j].user_id) {
                            return members[j].username;
                        }
                    }
                }
            } else if (
                week == "nextnextnext" &&
                assignments[i].this_week + 3 == assignments[i].week
            ) {
                if (assignments[i].task_id == taskid) {
                    for (let j = 0; j < members.length; j++) {
                        if (assignments[i].user_id == members[j].user_id) {
                            return members[j].username;
                        }
                    }
                }
            } else if (
                week == "nextnextnextnext" &&
                assignments[i].this_week + 4 == assignments[i].week
            ) {
                if (assignments[i].task_id == taskid) {
                    for (let j = 0; j < members.length; j++) {
                        if (assignments[i].user_id == members[j].user_id) {
                            return members[j].username;
                        }
                    }
                }
            } else if (
                week == "nextnextnextnextnext" &&
                assignments[i].this_week + 5 == assignments[i].week
            ) {
                if (assignments[i].task_id == taskid) {
                    for (let j = 0; j < members.length; j++) {
                        if (assignments[i].user_id == members[j].user_id) {
                            return members[j].username;
                        }
                    }
                }
            } else if (
                week == "nextnextnextnextnextnext" &&
                assignments[i].this_week + 6 == assignments[i].week
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

    const handleNewAssignment = () => {
        (async () => {
            const { assigntask, assignmember, weekassign } = userData;
            const member_id = members.filter(
                (mem) => mem.username == assignmember
            );
            const task_id = group.tasks.filter(
                (task) => task.title == assigntask
            );

            const newAssignment = await assignTask(
                member_id[0].user_id,
                groupId,
                task_id[0].id,
                weekassign
            );
            setAssignments((assignments) => {
                return [newAssignment, ...assignments];
            });
        })(); // end async iffie
    };

    const handleNewAssignmentRepeat = () => {
        (async () => {
            const {
                assigntaskrepeat,
                startmember,
                weekassignrepeat,
                weeknrrepeat,
            } = userData;

            const start_member_id = members.filter(
                (mem) => mem.username == startmember
            )[0].user_id;
            let member_id_arr = [];

            for (let i = 0; i < members.length; i++) {
                member_id_arr.push(members[i].user_id);
            }

            /* nice to have logic for picking starting member */
            let secondhalf;
            for (let j = 0; j < member_id_arr.length; j++) {
                if (member_id_arr[j] == start_member_id) {
                    secondhalf = member_id_arr.splice(j);
                }
            }

            member_id_arr = [...secondhalf, ...member_id_arr];

            const task_id = group.tasks.filter(
                (task) => task.title == assigntaskrepeat
            );

            const newRepeatAssignments = await repeatGroupAssignment(
                member_id_arr,
                groupId,
                weeknrrepeat,
                weekassignrepeat,
                task_id[0].id
            );

            // location.reload();

            setAssignments((assignments) => {
                return [...newRepeatAssignments, ...assignments];
            });
        })(); // end async iffie
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
                                <h3>{member.username}</h3>
                            </div>
                        );
                    })}
            </div>
            <h3>Tasks</h3>

            <div className="tasks">
                <div className="weeks">
                    <h4 className="week">Last Week </h4>
                    <h4 className="week">Current Week </h4>
                    <h4 className="week">
                        Week {assignments[0] && assignments[0].this_week + 1}
                    </h4>
                    <h4 className="week">
                        Week {assignments[0] && assignments[0].this_week + 2}
                    </h4>
                    <h4 className="week">
                        Week {assignments[0] && assignments[0].this_week + 3}
                    </h4>
                    <h4 className="week">
                        Week {assignments[0] && assignments[0].this_week + 4}
                    </h4>
                    <h4 className="week">
                        Week {assignments[0] && assignments[0].this_week + 5}
                    </h4>
                    <h4 className="week">
                        Week {assignments[0] && assignments[0].this_week + 6}
                    </h4>
                </div>
                {group.tasks &&
                    group.tasks.map((task) => {
                        return (
                            <div className="task" key={task.id}>
                                <h4
                                    className="sub"
                                    onClick={() => setTaskView(task.id)}
                                >
                                    {task.title}&nbsp;&nbsp;
                                </h4>
                                <i
                                    className="fas fa-trash-alt"
                                    onClick={() => handleDeleteTask(task.id)}
                                ></i>
                                <p className="task-input">
                                    {checkIfAssigned(task.id, "last")}
                                </p>
                                <p className={checkAllDone(task.id)}>
                                    {checkIfAssigned(task.id, "now")}
                                </p>
                                <p
                                    className="task-input"
                                    onInput={(e) => handleChange(e)}
                                >
                                    {checkIfAssigned(task.id, "next")}
                                </p>
                                <p
                                    className="task-input"
                                    onInput={(e) => handleChange(e)}
                                >
                                    {checkIfAssigned(task.id, "nextnext")}
                                </p>
                                <p
                                    className="task-input"
                                    onInput={(e) => handleChange(e)}
                                >
                                    {checkIfAssigned(task.id, "nextnextnext")}
                                </p>
                                <p
                                    className="task-input"
                                    onInput={(e) => handleChange(e)}
                                >
                                    {checkIfAssigned(
                                        task.id,
                                        "nextnextnextnext"
                                    )}
                                </p>
                                <p
                                    className="task-input"
                                    onInput={(e) => handleChange(e)}
                                >
                                    {checkIfAssigned(
                                        task.id,
                                        "nextnextnextnextnext"
                                    )}
                                </p>
                                <p
                                    className="task-input"
                                    onInput={(e) => handleChange(e)}
                                >
                                    {checkIfAssigned(
                                        task.id,
                                        "nextnextnextnextnextnext"
                                    )}
                                </p>
                            </div>
                        );
                    })}
            </div>
            <div className="assigntask">
                <h5>Assign Task</h5>
                <input
                    list="names"
                    type="option"
                    name="assignmember"
                    onInput={(e) => handleChange(e)}
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
                <input
                    name="weekassign"
                    type="number"
                    min="1"
                    max="52"
                    placeholder="week"
                    onChange={(e) => handleChange(e)}
                />
                <input
                    list="tasks"
                    type="option"
                    name="assigntask"
                    onInput={(e) => handleChange(e)}
                />
                <datalist id="tasks">
                    {group.tasks &&
                        group.tasks.map((task) => {
                            return <option value={task.title} key={task.id} />;
                        })}
                </datalist>
                <button onClick={handleNewAssignment}>Assign</button>
            </div>

            <h5>Assign Repeat Task</h5>
            <div className="assigntask">
                <input
                    list="names"
                    type="option"
                    name="startmember"
                    placeholder="Who starts?"
                    onInput={(e) => handleChange(e)}
                />
                <input
                    name="weekassignrepeat"
                    type="number"
                    min="1"
                    max="52"
                    placeholder="Starting week?"
                    onChange={(e) => handleChange(e)}
                />
                <input
                    name="weeknrrepeat"
                    type="number"
                    min="2"
                    max="8"
                    placeholder="For how many weeks?"
                    onChange={(e) => handleChange(e)}
                />
                <input
                    list="repeattasks"
                    type="option"
                    name="assigntaskrepeat"
                    onInput={(e) => handleChange(e)}
                />
                <datalist id="repeattasks">
                    {group.tasks &&
                        group.tasks.map((task) => {
                            return <option value={task.title} key={task.id} />;
                        })}
                </datalist>
                <button onClick={handleNewAssignmentRepeat}>Assign</button>
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
