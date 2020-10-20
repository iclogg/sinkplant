import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

import { markDone, adSubTask } from "./functions.js";

export default function TaskPage({ taskArr }) {
    let task = taskArr[0];
    const [newTask, setNewTask] = useState({});
    const [taskState, setTaskState] = useState({});

    const handleChange = (e) => {
        setNewTask(e.target.value);
    };
    useEffect(() => {
        setTaskState(task);
    }, []);

    return (
        <div className="task-detail">
            <h5>{task.title}</h5>
            {/* list of subtasks */}
            <div className="subtasks">
                {task.subtasks &&
                    task.subtasks.map((sub) => {
                        return (
                            <div className="task" key={sub.id}>
                                <input
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

                                <p className="sub">{sub.taskdescription}</p>
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
                />
                <button
                    onClick={async () => {
                        setTaskState(
                            taskState.subtasks.push(
                                await adSubTask(newTask, task.group_id, task.id)
                            )
                        );
                        console.log(task.subtasks);
                    }}
                >
                    Add Task
                </button>
            </div>
        </div>
    );
}
