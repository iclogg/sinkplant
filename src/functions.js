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
    //makes sure we are working with numbers
    nr_of_weeks = Number(nr_of_weeks) - 1;
    start_week = Number(start_week);

    //the array that will contain all the weeks in this repeat assignment
    let weekArr = [];

    //adds the weeks to the array not adjusting for weeks over 52
    while (nr_of_weeks > 0) {
        weekArr.unshift(start_week + nr_of_weeks);
        nr_of_weeks--;
    }

    // also ads the start week to the array
    weekArr.unshift(start_week);

    //loop over the weekArr and change any week over 53 to correct week next year.
    for (let i = 0; i < weekArr.length; i++) {
        if (weekArr[i] > 52) {
            weekArr[i] -= 52;
            console.log("weekArr[i]", weekArr[i]);
        }
    }

    // ads needed roations to the member_id_arr
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

            dataArr.push(data);
        } catch (err) {
            console.log(err);
        }
    }
    console.log(dataArr);
    return dataArr;
}

export function getFutureWeek(this_week, numFutureWeek) {
    if (this_week == 1 && numFutureWeek == -1) {
        return 52;
    }

    if (this_week + numFutureWeek > 52) {
        this_week -= 52;
    }

    return this_week + numFutureWeek;
}
