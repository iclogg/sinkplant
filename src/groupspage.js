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
        console.log("checkIfAssigned running");
        console.log("task.id", taskid);
        for (let i = 0; i < assignments.length; i++) {
            /*    console.log("assignments[i].week", assignments[i].week);
            console.log("assignments[i].week++", assignments[i].week--);
            console.log("assignments[i].week++", assignments[i].week--); */
            console.log(
                week == "now" && assignments[i].this_week == assignments[i].week
            );
            console.log(
                week == "last" &&
                    assignments[i].this_week - 1 == assignments[i].week
            );
            console.log(
                week == "next" &&
                    assignments[i].this_week + 1 == assignments[i].week
            );

            if (
                week == "now" &&
                assignments[i].this_week == assignments[i].week
            ) {
                if (assignments[i].task_id == taskid) {
                    for (let j = 0; j < members.length; j++) {
                        if (assignments[i].user_id == members[j].user_id) {
                            /*   setUserData({
                                ...userData,
                                [week]: members[j].username,
                            }); */
                            console.log(
                                "members[j].username now",
                                members[j].username
                            );

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
                            /*   setUserData({
                                ...userData,
                                [week]: members[j].username,
                            }); */
                            console.log(
                                "members[j].username last",
                                members[j].username
                            );

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
                            /* setUserData({
                                ...userData,
                                [week]: members[j].username,
                            }) */
                            console.log(
                                "members[j].username next",
                                members[j].username
                            );

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
            console.log("handleNewAssignment -> newAssignment", newAssignment);
            /* setAssignments((assignments) => {
                return [newAssignment, ...assignments];
            }); */
            location.reload();
            console.log("assignments", assignments);

            /*  setUserData({
                assignmember: null,
                assigntask: null,
                weekassign: null,
            }); */
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
            console.log("member_id_arr", member_id_arr);
            for (let j = 0; j < member_id_arr.length; j++) {
                if (member_id_arr[j] == start_member_id) {
                    console.log("member_id_arr", member_id_arr);
                    secondhalf = member_id_arr.splice(j);
                    console.log("member_id_arr", member_id_arr);
                }
            }

            member_id_arr = [...secondhalf, ...member_id_arr];
            console.log("member_id_arr", member_id_arr);

            const task_id = group.tasks.filter(
                (task) => task.title == assigntaskrepeat
            );
            console.log("", task_id);

            const newRepeatAssignments = await repeatGroupAssignment(
                member_id_arr,
                groupId,
                weeknrrepeat,
                weekassignrepeat,
                task_id[0].id
            );

            location.reload();

            console.log(
                "handleNewAssignment -> newAssignment",
                newRepeatAssignments
            );
            /* setAssignments(
                assignments.unshift(...newRepeatAssignments.reverse())
            ); */
            console.log("assignments", assignments);

            /* setUserData({
                assignmemberrepeat: null,
                repeattasks: null,
                weekassignrepeat: null,
            }); */
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
                                <p>{member.username}</p>
                            </div>
                        );
                    })}
            </div>
            <h3>Tasks</h3>

            <div className="tasks">
                <div className="weeks">
                    <p>
                        Last Week{" "}
                        {assignments[0] && assignments[0].this_week - 1}{" "}
                    </p>
                    <p>
                        This Week {assignments[0] && assignments[0].this_week}
                    </p>
                    <p>
                        Next Week{" "}
                        {assignments[0] && assignments[0].this_week + 1}
                    </p>
                </div>
                {group.tasks &&
                    group.tasks.map((task) => {
                        console.log("map running");

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
                            </div>
                        );
                    })}
            </div>
            <div className="assigntask">
                <h5>Assign Task</h5>
                <input
                    className="task-input"
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
                    className="task-input"
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
                    className="task-input"
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
                    className="task-input"
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
