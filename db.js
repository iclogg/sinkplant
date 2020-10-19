const spicedPg = require("spiced-pg");
const dbUrl =
    process.env.DATABASE_URL ||
    "postgres:postgres:postgres@localhost:5432/sinkplant";

const db = spicedPg(dbUrl);

/* =============== User in users =============== */

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
    console.log("id", id);

    return db.query(q, params);
};
