export function adCurrentUser(currentUser) {
    return {
        type: "CURRENT_USER",
        currentUser: currentUser,
    };
}
