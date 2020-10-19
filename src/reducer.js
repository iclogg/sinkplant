export default function reducer(state = {}, action) {
    if (action.type === "CURRENT_USER") {
        state = {
            ...state,
            currentUser: action.currentUser,
        };
    }
    if (action.type === "USER_GROUPS") {
        state = {
            ...state,
            userGroupInfo: action.userGroupInfo,
        };
    }

    return state;
}
