export default function reducer(state = {}, action) {
    if (action.type === "CURRENT_USER") {
        state = {
            ...state,
            currentUser: action.currentUser,
        };
    }

    return state;
}
