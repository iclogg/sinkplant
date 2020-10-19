import axios from "axios";

var instance = axios.create({
    xsrfCookieName: "mytoken",
    xsrfHeaderName: "csrf-token", // the csurf middle ware checks for this header to validate the token infomraiton.
});

export default instance;
