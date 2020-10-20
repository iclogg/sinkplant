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

/* newTask, task.group_id, task.id */
