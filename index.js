const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" }); // ad url where site is hosted
const compression = require("compression");
const db = require("./db");
const bodyParser = require("body-parser");
const csurf = require("csurf");
const { compare, hash } = require("./bc");

/* --nice to have-- */
// for implementing reset password email.
/* const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");  */

/* --nice to have-- */
//boilerplate to make image upload work
/* const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const config = require("./config");
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
}); */
// end boilerplate img upload

/* new cookie session */
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: process.env.SESSION_SECRET || require("./secrets").sessionSecret,
    maxAge: 1000 * 60 * 60 * 12,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
}); // cookie session end

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.set("x-frame-options", "DENY");
    next();
});

app.use(express.static(__dirname + "/public"));

app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
// ========================== routes ===============================//

// ========================== Welcome ========================//

app.get("/welcome", (req, res) => {
    // req.session.userId = null; // for testing

    if (req.session.userId) {
        console.log("in welcome get with userid");

        res.redirect("/");
    } else {
        console.log("in welcome get whitout userid");

        res.sendFile(__dirname + "/index.html");
    }
});

// ================== Register ================//

app.post("/api/register", (req, res) => {
    console.log("api/register");
    const { username, email, pass } = req.body.userData;

    if (!email || !username || !pass) {
        console.log("if");
        res.json();
    } else {
        console.log("else");

        hash(pass)
            .then((hashPass) => {
                db.addUser(username, email, hashPass)
                    .then((result) => {
                        req.session.userId = result.rows[0].id;
                        console.log("result.rows[0].id", result.rows[0].id);
                        result.rows[0].succsess = true;
                        res.json(result.rows[0]);
                    })
                    .catch((err) => {
                        console.log("err in welcome post route: ", err);
                        res.json();
                    });
            })
            .catch((err) => {
                console.log("err in /regiser hash", err);
                res.json();
            });
    }
});

// ================== Login ================//

app.post("/api/login", (req, res) => {
    db.getUser(req.body.userData.email)
        .then((result) => {
            compare(req.body.userData.pass, result.rows[0].password)
                .then((user) => {
                    if (user) {
                        console.log("post login compare if user");
                        req.session.userId = result.rows[0].id;
                        result.rows[0].succsess = true;
                        res.json(result.rows[0]);
                    } else {
                        console.log("post login compare if no user");
                        res.json();
                    }
                })
                .catch((err) => {
                    console.log("err in compare post /login: ", err);
                    res.json();
                });
        })
        .catch((err) => {
            console.log("err in get user post /login: ", err);
            res.json();
        });
});

// ========================== Logout ========================//

app.get("/api/logout/", (req, res) => {
    req.session.userId = null;
    res.redirect("*");
});

// ======================= Get User =======================//

app.get("/api/user", (req, res) => {
    db.getUserInfo(req.session.userId)
        .then((result) => {
            let userinfo = result.rows[0];
            db.getUserMemberships(req.session.userId)
                .then((result) => {
                    userinfo = { ...userinfo, memberships: [...result.rows] };
                    res.json(userinfo);
                })
                .catch((err) => {
                    "err in getUserMemberships in /api/user: ", err;
                });
        })
        .catch((err) => {
            "err in getUserInfo in /api/user: ", err;
        });
});
// ======================= Get Users Groups =======================//

app.get("/api/groups", (req, res) => {
    console.log("/api/groups");

    db.getUserGroups(req.query.groupsNrs, req.session.userId)
        .then((result) => {
            console.log("/api/groups result.rows: ", result.rows);

            res.json(result.rows);
        })
        .catch((err) => {
            "err in getUserInfo in /api/groups ", err;
        });
});

// ======================= Get Group =======================//
app.get("/api/grouppage", (req, res) => {
    console.log("/api/grouppage");
    db.getGroup(req.query.groupid)
        .then((result) => {
            let group = result.rows[0];
            db.getTasks(req.query.groupid)
                .then((tasksArr) => {
                    group.tasks = tasksArr.rows;
                    db.getSubTasks(req.query.groupid)
                        .then((subTasksArr) => {
                            for (let i = 0; i < group.tasks.length; i++) {
                                group.tasks[i].subtasks = [];
                                for (
                                    let j = 0;
                                    j < subTasksArr.rows.length;
                                    j++
                                ) {
                                    if (
                                        group.tasks[i].id ==
                                        subTasksArr.rows[j].task_id
                                    ) {
                                        group.tasks[i].subtasks.push(
                                            subTasksArr.rows[j]
                                        );
                                    }
                                }
                            }

                            res.json(group);
                        })
                        .catch((err) => {
                            "err in getSubTasks in /api/grouppage ", err;
                        });
                })
                .catch((err) => {
                    "err in getTasks in /api/grouppage ", err;
                });
        })
        .catch((err) => {
            "err in getGroup in /api/grouppage ", err;
        });
});

// ======================= Get Members of Group =======================//

app.get("/api/groupmembers", (req, res) => {
    console.log("/api/groupmembers");

    db.getMemberships(req.query.groupid)
        .then((result) => {
            let memberIds = [];
            for (let i = 0; i < result.rows.length; i++) {
                memberIds.push(result.rows[i].member_id);
            }
            db.getMembers(memberIds)
                .then((result) => {
                    res.json(result.rows);
                })
                .catch((err) => {
                    "err in getMembers in /api/groupmembers ", err;
                });
        })
        .catch((err) => {
            "err in getMemberships in /api/groupmembers ", err;
        });
});

// ======================= Update Membership Status =======================//

app.post("/api/updateMembership", (req, res) => {
    console.log("/api/updateMembership");

    let dbqery;
    let newBtnText;

    if (req.body.btnText == "Join Group") {
        dbqery = db.acceptGroupInvite;
        newBtnText = "Leave Group";
    } else if (req.body.btnText == "Delete Membership") {
        dbqery = db.deleteMembership;
        newBtnText = "Send Invite";
    }

    dbqery(req.body.idGroup, req.session.userId)
        .then(() => {
            res.json(newBtnText);
        })
        .catch((err) => {
            console.log("err in dbqery in api/sendFriendStatus ", err);
        });
});

app.post("/api/sendInvite", (req, res) => {
    console.log("/api/sendInvite");

    db.getUserInfoViaEmail(req.body.inviteEmail)
        .then((result) => {
            console.log();
            db.sendGroupInvite(req.body.groupId, result.rows[0].user_id)
                .then(() => {
                    res.json();
                })
                .catch((err) => {
                    console.log(
                        "err in sendGroupInvite in api/sendInvite ",
                        err
                    );
                });
        })
        .catch((err) => {
            console.log("err in getUserInfoViaEmail in api/sendInvite ", err);
        });
});

// ====================================== Task Statuses ======================================//

app.post("/api/togglesubtaskdone", (req, res) => {
    console.log("/api/subtaskdone");

    db.togglesubtaskdone(req.body.taskid, req.body.done)
        .then(() => {
            // res.json(newBtnText);
        })
        .catch((err) => {
            console.log("err in dbqery in api/subtaskdone ", err);
        });
});

app.post("/api/toggletaskdone", (req, res) => {
    console.log("/api/toggletaskdone");

    db.toggletaskdone(req.body.taskid, req.body.done)
        .then(() => {
            // res.json(newBtnText);
        })
        .catch((err) => {
            console.log("err in dbqery in api/toggletaskdone ", err);
        });
});

// ====================================== Task Adding  ======================================//
app.post("/api/adSubTask/", (req, res) => {
    console.log("/api/adSubTask");

    db.adSubTask(req.body.taskdescription, req.body.group_id, req.body.task_id)
        .then((result) => {
            console.log("result.rows[0]in adSubTask", result.rows[0]);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("err in dbqery in api/adSubTask ", err);
        });
});

app.post("/api/adTask/", (req, res) => {
    console.log("/api/adTask");

    db.adTask(req.body.taskDescription, req.body.group_id, req.body.title)
        .then((result) => {
            console.log("result.rows[0]in adTask", result.rows[0]);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("err in dbqery in api/adTask ", err);
        });
});

// ====================================== Task Removing  ======================================//

app.post("/api/deleteSubTask/", (req, res) => {
    console.log("/api/deleteSubTask");

    db.deleteSubTask(req.body.task_id)
        .then((result) => {
            console.log("result.rows[0]in deleteSubTask", result.rows[0]);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("err in dbqery in api/deleteSubTask ", err);
        });
});

app.post("/api/deleteTask/", (req, res) => {
    console.log("/api/deleteTask");

    db.deleteAllSubTask(req.body.task_id)
        .then(() => {
            db.deleteTask(req.body.task_id);
        })
        .then(() => {
            res.json();
        })
        .catch((err) => {
            console.log("err in dbqery in api/deleteTask ", err);
        });
});

// ====================================== Assignments  ======================================//
app.get("/api/currentassignments", (req, res) => {
    console.log("/api/currentassignments");

    db.getCurrentWeeks(req.query.groupid)
        .then((result) => {
            console.log(result.rows);
            res.json(result.rows);
        })
        .catch((err) => {
            "err in getMemberships in /api/currentassignments ", err;
        });
});

// ======================= Star route. =======================//

app.get("*", function (req, res) {
    if (!req.session.userId) {
        console.log("in * get without userid");

        res.redirect("/welcome");
    } else {
        console.log("in * with userid");
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, () => {
    console.log("I'm listening.");
});

// ====================================== Sockets ======================================//

let onlineUsers = {};

io.on("connection", function (socket) {
    if (!socket.request.session.userId) {
        console.log("!socket.request.session.userId ");
        return socket.disconnect(true);
    }
    const userId = socket.request.session.userId;

    // ============================== online users ==============================//
    /* 
    db.getOnlineUsers(Object.values(onlineUsers))
        .then((data) => {
            io.emit("onlineUsers", data.rows);
        })
        .catch((err) => {
            console.log("err in catch getOnlineUsers: ", err);
        }); */

    // user joined //

    /*   let loggedinalready = false;
    for (let user in onlineUsers) {
        if (onlineUsers[user] == userId) {
            loggedinalready = true;
        }
    } */

    onlineUsers[socket.id] = userId;

    /*  if (!loggedinalready) {
        console.log("userNr joined: ", userId);
        db.getNewUserOnline(userId)
            .then((data) => {
                socket.broadcast.emit("userJoined", data.rows[0]);
            })
            .catch((err) => {
                console.log("err in catch getNewUserOnline: ", err);
            });
    } */

    // user left //

    /*   socket.on("disconnect", () => {
        console.log(
            "onlineUsers[socket.id] discconeced: ",
            onlineUsers[socket.id]
        );

        const userNr = onlineUsers[socket.id];

        delete onlineUsers[socket.id];

        let loggedin = true;
        for (let user in onlineUsers) {
            if (onlineUsers[user] == userNr) {
                loggedin = false;
            }
        }

        if (loggedin) {
            io.sockets.emit("userLeft", userNr);
        }
    }); */
});
