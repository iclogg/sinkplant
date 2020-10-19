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
    console.log("req.session.userId", req.session.userId);

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
