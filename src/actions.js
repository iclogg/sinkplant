import axios from "./axios";

export async function adCurrentUser() {
    try {
        const { data } = await axios.get("/api/user");
        return {
            type: "CURRENT_USER",
            currentUser: data,
        };
    } catch (err) {
        console.log(err);
    }
}

export async function receiveGroups(groupsNrs) {
    console.log("receiveGroups -> groupsNrs", groupsNrs);

    try {
        const { data } = await axios.get("/api/groups", {
            params: { groupsNrs: groupsNrs },
        });
        console.log("Groups -> data", data);
        return {
            type: "USER_GROUPS",
            userGroupInfo: data,
        };
    } catch (err) {
        console.log(err);
    }
}
