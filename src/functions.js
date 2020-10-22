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

export async function assignTask(member_id, groupId, assigntask, weekassign) {
    console.log(
        "assignTask -> member_id, groupId, assigntask, weekassign",
        member_id,
        groupId,
        assigntask,
        weekassign
    );
    try {
        const { data } = await axios.post("/api/assigntask", {
            member_id,
            groupId,
            assigntask,
            weekassign,
        });
        console.log("currentassignments in functions: ", data);
        data.this_week = 43;
        return data;
    } catch (err) {
        console.log(err);
    }
}

export async function repeatGroupAssignment(
    member_id_arr,
    groupId,
    nr_of_weeks,
    start_week,
    task_id
) {
    nr_of_weeks = Number(nr_of_weeks) - 1;
    start_week = Number(start_week);

    let weekArr = [];

    while (nr_of_weeks > 0) {
        weekArr.unshift(start_week + nr_of_weeks);
        nr_of_weeks--;
    }
    weekArr.unshift(start_week);
    while (member_id_arr.length < weekArr.length) {
        member_id_arr.push(...member_id_arr);
    }

    let assigmentArr = [];

    for (let i = 0; i < weekArr.length; i++) {
        assigmentArr = [
            ...assigmentArr,
            {
                member_id: member_id_arr[i],
                groupId: groupId,
                assigntask: task_id,
                weekassign: weekArr[i],
            },
        ];
        /* await db.assignTask(member_id_arr[i], groupId, task_id, nr_of_weeks[i]); */
    }
    let dataArr = [];
    for (let j = 0; j < assigmentArr.length; j++) {
        const { member_id, groupId, assigntask, weekassign } = assigmentArr[j];
        try {
            const { data } = await axios.post("/api/assigntask", {
                member_id,
                groupId,
                assigntask,
                weekassign,
            });

            data.this_week = 43;

            dataArr.push(data);
        } catch (err) {
            console.log(err);
        }
    }
    console.log(dataArr);
    return dataArr;
}
