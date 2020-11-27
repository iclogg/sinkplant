import React, { useEffect, useState } from "react";
// import { socket } from "./socket.js";

import {
    getGroup,
    getMembers,
    getCurrentWeeks,
    assignTask,
    adTask,
    deleteTask,
    repeatGroupAssignment,
    getFutureWeek,
} from "./functions.js";

/* components */
import Invite from "./invite.js";
import TaskPage from "./taskpage.js";
import ExampleTask from "./exampletask.js";

export default function GroupPage() {
    const [group, setGroup] = useState({});
    const [members, setMembers] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [taskView, setTaskView] = useState(null);
    const [userData, setUserData] = useState({
        title: "",
        taskDescription: "",
    });

    const groupId = Number(window.location.pathname.slice(8));

    useEffect(() => {
        (async () => {
            setGroup(await getGroup(groupId));
            setMembers(await getMembers(groupId));
            setAssignments(await getCurrentWeeks(groupId));
        })(); // end async iffie
    }, [setTaskView]);

    // handles data from inputs
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    // ads a new task to database and state
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

    // deletes a task from database and state
    const handleDeleteTask = (task_id) => {
        (async () => {
            await deleteTask(task_id);
            setGroup({
                ...group,
                tasks: group.tasks.filter((task) => task.id != task_id),
            });
        })(); // end async iffie
    };

    // toggles the detailed taks view. passed as props to TaskPage component
    const toggleTastView = () => {
        setTaskView(null);
        (async () => {
            setGroup(await getGroup(groupId));
            setMembers(await getMembers(groupId));
        })();
    };

    // decides color on taskgrid by checking if all subtasks of the task are done
    const checkAllDone = (task_id) => {
        for (let i = 0; i < group.tasks.length; i++) {
            if (group.tasks[i].id == task_id) {
                if (group.tasks[i].subtasks) {
                    for (let j = 0; j < group.tasks[i].subtasks.length; j++) {
                        if (!group.tasks[i].subtasks[j].done) {
                            return "task-input notdone clickable";
                        }
                    }
                }
            }
        }

        return "task-input alldone clickable";
    };

    // returns a string with name of assigned member to fields in the task grid if that slot is assigned.
    // 'week' argument is a string describing the relation to the current week. example: last, now, next, nextnext...

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
                getFutureWeek(
                    assignments[i].this_week,
                    -1,
                    assignments[0].last_week_curr_year
                ) == assignments[i].week
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
                getFutureWeek(
                    assignments[i].this_week,
                    1,
                    assignments[0].last_week_curr_year
                ) == assignments[i].week
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
                getFutureWeek(
                    assignments[i].this_week,
                    2,
                    assignments[0].last_week_curr_year
                ) == assignments[i].week
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
                getFutureWeek(
                    assignments[i].this_week,
                    3,
                    assignments[0].last_week_curr_year
                ) == assignments[i].week
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
                getFutureWeek(
                    assignments[i].this_week,
                    4,
                    assignments[0].last_week_curr_year
                ) == assignments[i].week
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
                getFutureWeek(
                    assignments[i].this_week,
                    5,
                    assignments[0].last_week_curr_year
                ) == assignments[i].week
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
                getFutureWeek(
                    assignments[i].this_week,
                    6,
                    assignments[i].last_week_curr_year
                ) == assignments[i].week
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

    // ads a new assigment to database and state
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

    // ads a new assigments from repeat assignment feature to database and state
    const handleNewAssignmentRepeat = () => {
        (async () => {
            const {
                assigntaskrepeat,
                startmember,
                weekassignrepeat,
                weeknrrepeat,
            } = userData;

            // gets the user_id from the start-member name
            const start_member_id = members.filter(
                (mem) => mem.username == startmember
            )[0].user_id;

            // creates an array of all the groupmembers user_id
            let member_id_arr = [];
            for (let i = 0; i < members.length; i++) {
                member_id_arr.push(members[i].user_id);
            }

            // splits the array at the start member
            let secondhalf;
            for (let j = 0; j < member_id_arr.length; j++) {
                if (member_id_arr[j] == start_member_id) {
                    secondhalf = member_id_arr.splice(j);
                }
            }

            // concatinates the spliced arrays of user_ids to create one with the correct order for the assignment.
            member_id_arr = [...secondhalf, ...member_id_arr];

            const task_id = group.tasks.filter(
                (task) => task.title == assigntaskrepeat
            );

            //creates the new assignments, sends them to the database and returns an array of the new assignments
            const newRepeatAssignments = await repeatGroupAssignment(
                member_id_arr,
                groupId,
                weeknrrepeat,
                weekassignrepeat,
                task_id[0].id,
                assignments[0].last_week_curr_year
            );

            setAssignments((assignments) => {
                return [...newRepeatAssignments, ...assignments];
            });
        })(); // end async iffie
    };

    return (
        <div className="grouppage">
            <div id="header-box">
                <h1> {group.groupname} </h1>
                <p>{group.groupbio}</p>
            </div>

            <div id="members-box">
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
            </div>

            <h2 id="todo">To-Do's</h2>
            <div className="tasks">
                <div className="weeks">
                    <h4 className="week">Last Week </h4>
                    <h4 className="week currentweek">Current Week </h4>
                    <h4 className="week">
                        Week{" "}
                        {assignments[0] &&
                            getFutureWeek(
                                assignments[0].this_week,
                                1,
                                assignments[0].last_week_curr_year
                            )}
                    </h4>
                    <h4 className="week">
                        Week{" "}
                        {assignments[0] &&
                            getFutureWeek(
                                assignments[0].this_week,
                                2,
                                assignments[0].last_week_curr_year
                            )}
                    </h4>
                    <h4 className="week">
                        Week{" "}
                        {assignments[0] &&
                            getFutureWeek(
                                assignments[0].this_week,
                                3,
                                assignments[0].last_week_curr_year
                            )}
                    </h4>
                    <h4 className="week">
                        Week{" "}
                        {assignments[0] &&
                            getFutureWeek(
                                assignments[0].this_week,
                                4,
                                assignments[0].last_week_curr_year
                            )}
                    </h4>
                    <h4 className="week">
                        Week{" "}
                        {assignments[0] &&
                            getFutureWeek(
                                assignments[0].this_week,
                                5,
                                assignments[0].last_week_curr_year
                            )}
                    </h4>
                    <h4 className="week">
                        Week{" "}
                        {assignments[0] &&
                            getFutureWeek(
                                assignments[0].this_week,
                                6,
                                assignments[0].last_week_curr_year
                            )}
                    </h4>
                </div>

                <div className="task-grid">
                    {group.tasks && group.tasks.length == 0 && <ExampleTask />}

                    {group.tasks &&
                        group.tasks.map((task) => {
                            return (
                                <div className="task" key={task.id}>
                                    <h4
                                        className="tasktitle clickable"
                                        onClick={() => setTaskView(task.id)}
                                    >
                                        {task.title}&nbsp;&nbsp;
                                    </h4>
                                    <i
                                        className="fas fa-trash-alt"
                                        onClick={() =>
                                            handleDeleteTask(task.id)
                                        }
                                    ></i>
                                    <p className="task-input">
                                        {checkIfAssigned(task.id, "last")}
                                    </p>
                                    <p
                                        className={checkAllDone(task.id)}
                                        onClick={() => setTaskView(task.id)}
                                    >
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
                                        {checkIfAssigned(
                                            task.id,
                                            "nextnextnext"
                                        )}
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
            </div>

            <div className="assigntask single">
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

            <div className="assigntask repeat">
                <h5>Assign Repeat Task</h5>
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
                    placeholder="How many weeks?"
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

            <Invite groupId={groupId} />
            {taskView && (
                <TaskPage
                    taskArr={group.tasks.filter((task) => task.id == taskView)}
                    toggleTastView={toggleTastView}
                />
            )}
        </div>
    );
}
