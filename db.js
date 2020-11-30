const spicedPg = require("spiced-pg");
const dbUrl = process.env.DATABASE_URL || require("./db-secrets");
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

/* ============================== Add Group ========================== */

module.exports.adGroup = (name, groupDescription, userId) => {
    const q = `
        INSERT into groups (groupname, groupBio, creator)
        values($1, $2, $3) RETURNING *
        `;
    const params = [name, groupDescription, userId];
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

/* ============================== Task Adding ========================== */

module.exports.adSubTask = (taskdescription, group_id, task_id) => {
    const q = `
        INSERT into subtasks (taskDescription, group_id, task_id)
        values($1, $2, $3) RETURNING *
        `;
    const params = [taskdescription, group_id, task_id];
    return db.query(q, params);
};

module.exports.adTask = (taskDescription, group_id, title) => {
    const q = `
        INSERT into tasks (taskDescription, group_id, title)
        values($1, $2, $3) RETURNING *
        `;
    const params = [taskDescription, group_id, title];
    return db.query(q, params);
};

// ====================================== Task Removing  ======================================//

module.exports.deleteSubTask = (task_id) => {
    const q = `
        DELETE FROM subtasks
        WHERE id = $1 
        `;
    const params = [task_id];
    return db.query(q, params);
};

module.exports.deleteAllSubTask = (parent_task_id) => {
    const q = `
        DELETE FROM subtasks
        WHERE task_id = $1 
        `;
    const params = [parent_task_id];
    return db.query(q, params);
};

module.exports.deleteTask = (task_id) => {
    const q = `
        DELETE FROM tasks
        WHERE id = $1 
        `;
    const params = [task_id];
    return db.query(q, params);
};

// ====================================== Get Assignments  ======================================//

module.exports.getCurrentWeeks = (group_id) => {
    console.log("group_id", group_id);

    const q = `
        SELECT *, 
        (SELECT EXTRACT(WEEK FROM  (date (( date_part('year', now()) || '-12-31')) + time '01:00:00')) AS last_week_curr_year) 
        ,(SELECT EXTRACT(WEEK FROM CURRENT_TIMESTAMP) AS this_week) from assignment 
        WHERE week = (SELECT EXTRACT(WEEK FROM CURRENT_TIMESTAMP))
        OR week = (SELECT EXTRACT(WEEK FROM (CURRENT_TIMESTAMP + INTERVAL '-168 hours')))
        OR week = (SELECT EXTRACT(WEEK FROM (CURRENT_TIMESTAMP + INTERVAL '168 hours')))
        OR week = (SELECT EXTRACT(WEEK FROM (CURRENT_TIMESTAMP + INTERVAL '336 hours')))
        OR week = (SELECT EXTRACT(WEEK FROM (CURRENT_TIMESTAMP + INTERVAL '504 hours')))
        OR week = (SELECT EXTRACT(WEEK FROM (CURRENT_TIMESTAMP + INTERVAL '672 hours')))
        OR week = (SELECT EXTRACT(WEEK FROM (CURRENT_TIMESTAMP + INTERVAL '840 hours')))
        OR week = (SELECT EXTRACT(WEEK FROM (CURRENT_TIMESTAMP + INTERVAL '1008 hours')))
        AND group_id = $1
        ORDER BY id DESC;
        `;
    const params = [group_id];
    return db.query(q, params);
};

module.exports.assignTask = (member_id, groupId, assigntask, weekassign) => {
    const q = `
        INSERT into assignment (user_id, group_id, task_id, week)
        values($1, $2, $3, $4) RETURNING * , 
        (SELECT EXTRACT(WEEK FROM  (date (( date_part('year', now()) || '-12-31')) + time '01:00:00')) AS last_week_curr_year), 
        (SELECT EXTRACT(WEEK FROM CURRENT_TIMESTAMP) AS this_week)
        `;
    const params = [member_id, groupId, assigntask, weekassign];
    return db.query(q, params);
};
