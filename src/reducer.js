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

    if (action.type === "ACCEPT_GROUP_INVITE") {
        /* OBS@!!!!!!! Group_ vs groups_id needs fixing */

        /* state = Object.assign({}, state, {
            currentUser: state.currentUser.memberships.map((group) => {
                console.log(
                    "state.currentUser.memberships",
                    state.currentUser.memberships
                );
                console.log(
                    "reducer -> group.groups_id, action.id",
                    group.group_id,
                    action.id
                );

                if (group.group_id == action.id) {
                    group.accepted = true;
                }
                return group;
            }),
        }); */

        state = Object.assign({}, state, {
            userGroupInfo: state.userGroupInfo.map((group) => {
                if (group.groups_id == action.id) {
                    group.accepted = true;
                }
                return group;
            }),
        });
    }

    if (action.type === "LEAVE_GROUP") {
        state = Object.assign({}, state, {
            userGroupInfo: state.userGroupInfo.filter(
                (group) => group.groups_id != action.id
            ),
        });
    }

    if (action.type === "AD_GROUP") {
        state = {
            ...state,
            userGroupInfo: [...state.userGroupInfo, action.newGroup],
        };
    }

    return state;
}
