const spicedPg = require("spiced-pg");
const dbUrl =
    process.env.DATABASE_URL ||
    "postgres:postgres:postgres@localhost:5432/sinkplant";

const db = spicedPg(dbUrl);

/* =============== Login and Registration =============== */

module.exports.addUser = (username, email, hashPw) => {
    const q = `
        INSERT into users (username, email, password)
        values($1, $2, $3) RETURNING id
        `;
    const params = [username, email, hashPw];
    return db.query(q, params);
};

module.exports.getUser = (email) => {
    const q = `
        SELECT password, id FROM users WHERE email = $1
        `;
    const params = [email];
    return db.query(q, params);
};

/* ============================== App gets user info ========================== */

module.exports.getUserInfo = (id) => {
    const q = `
        SELECT email, username, id AS user_id, profileurl
        FROM users 
        WHERE id = $1
        `;
    const params = [id];
    console.log("id", id);

    return db.query(q, params);
};

module.exports.getUserMemberships = (id) => {
    const q = `
        SELECT memberships.id AS memberships_id, group_id, accepted
        FROM memberships 
        WHERE member_id = $1
        `;
    const params = [id];
    return db.query(q, params);
};

/* ============================== Groups gets group info ========================== */

module.exports.getUserGroups = (groupsIds, userId) => {
    const q = `
        SELECT groups.id AS groups_id, creator, groups.created_at AS startdate, groupBio, groupname, accepted
        FROM groups
        LEFT JOIN memberships 
        ON groups.id = memberships.group_id
        WHERE groups.id = ANY($1) AND member_id = $2 
        `;
    const params = [groupsIds, userId];

    return db.query(q, params);
};

/* ============================== Gets group detailed info ========================== */
module.exports.getGroup = (group_id) => {
    const q = `
        SELECT *
        FROM groups
        WHERE id = $1
        `;
    const params = [group_id];

    return db.query(q, params);
};

module.exports.getTasks = (group_id) => {
    const q = `
        SELECT *
        FROM tasks
        WHERE group_id = $1
        `;
    const params = [group_id];

    return db.query(q, params);
};

module.exports.getSubTasks = (group_id) => {
    const q = `
        SELECT *
        FROM subtasks
        WHERE group_id = $1
        `;
    const params = [group_id];

    return db.query(q, params);
};

module.exports.getMemberships = (group_id) => {
    const q = `
        SELECT *
        FROM memberships
        WHERE group_id = $1 AND accepted = true
        `;
    const params = [group_id];

    return db.query(q, params);
};

module.exports.getMembers = (users_id_arr) => {
    const q = `
        SELECT username, id AS user_id, email, created_at, profileUrl
        FROM users
        WHERE id = ANY($1)

        `;
    const params = [users_id_arr];

    return db.query(q, params);
};

/* ============================== Update membership status  ========================== */

module.exports.getUserInfoViaEmail = (email) => {
    const q = `
        SELECT email, username, id AS user_id, profileurl
        FROM users 
        WHERE email = $1
        `;
    const params = [email];
    return db.query(q, params);
};

module.exports.sendGroupInvite = (group_id, member_id) => {
    const q = `
        INSERT into memberships (group_id, member_id) values($1, $2)
        `;
    const params = [group_id, member_id];
    return db.query(q, params);
};

/* UPDATE - Accept Friend Request */

module.exports.acceptGroupInvite = (group_id, member_id) => {
    const q = `
        UPDATE memberships SET accepted = true
        WHERE group_id = $1 AND member_id = $2
        `;
    const params = [group_id, member_id];
    return db.query(q, params);
};

/* DELETE - Cancel Friend Request or End Friendship */

module.exports.deleteMembership = (group_id, member_id) => {
    const q = `
        DELETE FROM memberships
        WHERE (group_id = $1 AND member_id = $2)
        `;
    const params = [group_id, member_id];
    return db.query(q, params);
};

/* ============================== Update tasks status  ========================== */

module.exports.togglesubtaskdone = (task_id, done) => {
    const q = `
        UPDATE subtasks SET done = $2
        WHERE id = $1
        `;
    const params = [task_id, !done];
    return db.query(q, params);
};

module.exports.toggletaskdone = (task_id, done) => {
    const q = `
        UPDATE tasks SET done = $2
        WHERE id = $1 
        `;
    const params = [task_id, !done];
    return db.query(q, params);
};

/* ============================== Task Adding ========================== */

module.exports.adSubTask = (taskdescription, group_id, task_id) => {
    const q = `
        INSERT into subtasks (taskDescription, group_id, task_id)
        values($1, $2, $3) RETURNING *
        `;
    const params = [taskdescription, group_id, task_id];
    return db.query(q, params);
};
