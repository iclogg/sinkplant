import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

import { markDone } from "./functions.js";

export default function TaskPage({ taskArr }) {
    let task = taskArr[0];
    console.log("task", task);
    // task.subtasks[1].done = true; for testing

    return (
        <div className="task-detail">
            <h5>{task.title}</h5>
            <div className="subtasks">
                {task.subtasks &&
                    task.subtasks.map((sub) => {
                        return (
                            <div className="task" key={sub.id}>
                                <input
                                    type="checkbox"
                                    onClick={() =>
                                        markDone(sub.id, "subtaskdone")
                                    }
                                />
                                <p className={sub.done ? "done sub" : "sub"}>
                                    {sub.taskdescription}
                                </p>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
