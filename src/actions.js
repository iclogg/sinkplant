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

// ======================= Update Membership Status =======================//

/* later on individual group page*/
/* export async function sendGroupInvite(idGroup) {
    const btnText = "Accept Friend Request";
    try {
        const { data } = await axios.post(`/api/updateMembership/`, {
            btnText,
            idGroup,
        });

        return {
            type: "ACCEPT_GROUP_INVITE",
            id: idGroup,
        };
    } catch (err) {
        console.log(err);
    }
} */

export async function acceptGroupInvite(idGroup) {
    const btnText = "Join Group";
    try {
        const { data } = await axios.post(`/api/updateMembership/`, {
            btnText,
            idGroup,
        });
        return {
            type: "ACCEPT_GROUP_INVITE",
            id: idGroup,
        };
    } catch (err) {
        console.log(err);
    }
}

export async function leaveGroup(idGroup) {
    const btnText = "Delete Membership";
    try {
        const { data } = await axios.post(`/api/updateMembership/`, {
            btnText,
            idGroup,
        });
        return {
            type: "LEAVE_GROUP",
            id: idGroup,
        };
    } catch (err) {
        console.log(err);
    }
}

export async function adGroup(name, groupDescription) {
    try {
        const { data } = await axios.post(`/api/adGroup/`, {
            name,
            groupDescription,
        });
        console.log("Groups -> data", data);

        data.accepted = true;
        data.groups_id = data.id;
        data.startdate = data.created_at;

        return {
            type: "AD_GROUP",
            newGroup: data,
        };
    } catch (err) {
        console.log(err);
    }
}

// ======================= Get Info for Tasks Page =======================//

export async function getGroup(groupId) {
    console.log("receiveGroups -> groupId", groupId);

    try {
        const { data } = await axios.get("/api/groupspage", {
            params: { groupId: groupId },
        });

        return {
            type: "USER_GROUPS",
            userGroupInfo: data,
        };
    } catch (err) {
        console.log(err);
    }
}
