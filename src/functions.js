import axios from "./axios";

export async function getGroup(groupid) {
    try {
        const { data } = await axios.get("/api/grouppage", {
            params: { groupid },
        });
        console.log("group: ", data);

        return data;
    } catch (err) {
        console.log(err);
    }
}

export async function getMembers(groupid) {
    console.log(" getMembers(groupid)", groupid);

    try {
        const { data } = await axios.get("/api/groupmembers", {
            params: { groupid },
        });
        console.log("members: ", data);

        return data;
    } catch (err) {
        console.log(err);
    }
}

export async function markDone(taskid, typetask, done) {
    console.log("markDone -> done", done);

    try {
        const { data } = await axios.post(`/api/${typetask}/`, {
            taskid,
            done,
        });
        return data;
    } catch (err) {
        console.log(err);
    }
}

export async function adSubTask(taskdescription, group_id, task_id) {
    console.log(taskdescription);

    try {
        const { data } = await axios.post(`/api/adSubTask/`, {
            taskdescription,
            group_id,
            task_id,
        });

        return data;
    } catch (err) {
        console.log(err);
    }
}

export async function adTask(taskDescription, group_id, title) {
    console.log(
        "adTask(taskDescription, group_id, title)",
        taskDescription,
        group_id,
        title
    );

    try {
        const { data } = await axios.post(`/api/adTask/`, {
            taskDescription,
            group_id,
            title,
        });
        return data;
    } catch (err) {
        console.log(err);
    }
}

export async function deleteSubTask(task_id) {
    try {
        const { data } = await axios.post(`/api/deleteSubTask/`, {
            task_id,
        });
        console.log("subtasktask deleted");

        return task_id;
    } catch (err) {
        console.log(err);
    }
}

export async function deleteTask(task_id) {
    try {
        const { data } = await axios.post(`/api/deleteTask/`, {
            task_id,
        });
        console.log("task deleted");

        return task_id;
    } catch (err) {
        console.log(err);
    }
}

export async function getCurrentWeeks(groupid) {
    try {
        const { data } = await axios.get("/api/currentassignments", {
            params: { groupid },
        });
        console.log("currentassignments in functions: ", data);

        return data;
    } catch (err) {
        console.log(err);
    }
}
