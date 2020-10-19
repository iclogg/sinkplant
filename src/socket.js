import * as io from "socket.io-client";
/* import // some actions
"./actions.js"; */

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
    }
};
