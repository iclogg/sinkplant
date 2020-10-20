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

export async function markDone(subtaskid, typetask) {
    try {
        const { data } = await axios.post(`/api/${typetask}/`, {
            subtaskid,
        });
        return data;
    } catch (err) {
        console.log(err);
    }
}
