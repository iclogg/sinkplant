import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

import { markDone, adSubTask, deleteSubTask } from "./functions.js";

export default function TaskPage({ taskArr, toggleTastView }) {
    let task = taskArr[0];
    if (task.subtasks === undefined) {
        task.subtasks = [];
    }

    const [newTask, setNewTask] = useState("");
    const [taskState, setTaskState] = useState({});

    const handleChange = (e) => {
        setNewTask(e.target.value);
    };
    useEffect(() => {
        setTaskState(task);
    }, []);

    return (
        <>
            <div className="task-detail">
                <h1>{taskState.title}</h1>
                <h2 className="x clickable" onClick={toggleTastView}>
                    X
                </h2>
                <div className="threeem">
                    <h3>What needs doing?</h3>
                    <br />
                    <p>{taskState.taskdescription}</p>

                    {/* list of subtasks */}
                    <h4>To-Do's</h4>
                    <div className="subtasks">
                        {taskState.subtasks &&
                            taskState.subtasks.map((sub) => {
                                return (
                                    <div className="subtask" key={sub.id}>
                                        <input
                                            id="checkbox"
                                            type="checkbox"
                                            onClick={() => {
                                                markDone(
                                                    sub.id,
                                                    "togglesubtaskdone",
                                                    sub.done
                                                );
                                                sub.done = !sub.done;
                                            }}
                                            defaultChecked={sub.done}
                                        />

                                        <p className="sub">
                                            {sub.taskdescription}{" "}
                                        </p>
                                        <i
                                            className="fas fa-trash-alt clickable"
                                            onClick={() => {
                                                deleteSubTask(sub.id);
                                                setTaskState({
                                                    ...taskState,
                                                    subtasks: taskState.subtasks.filter(
                                                        (subtask) =>
                                                            subtask.id != sub.id
                                                    ),
                                                });
                                            }}
                                        ></i>
                                    </div>
                                );
                            })}
                    </div>
                    {/* add subtasks */}
                    <div className="adsubtask">
                        <h5>Ad Subtask</h5>
                        <input
                            name="newtask"
                            type="text"
                            placeholder="short description"
                            onChange={(e) => handleChange(e)}
                            value={newTask}
                        />
                        <button
                            onClick={async () => {
                                setTaskState({
                                    ...taskState,
                                    subtasks: [
                                        ...taskState.subtasks,
                                        await adSubTask(
                                            newTask,
                                            taskState.group_id,
                                            taskState.id
                                        ),
                                    ],
                                });
                                setNewTask("");
                            }}
                        >
                            Add Task
                        </button>
                    </div>
                </div>
            </div>

            <div className="overlay"></div>
        </>
    );
}
