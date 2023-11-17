export const actions = {
    nuxtClientInit({ dispatch, getters }, context) {
        dispatch('todo/setUserData', context.$userStorage.getUserData());

        if (getters['todo/isLogged'] === true) {
            dispatch('todo/updateToken');
            dispatch('todo/updatePermissions', context.$userStorage);
            dispatch('todo/updateTodoGroups', context.$userStorage);
        }
    },
    nuxtServerInit({ dispatch, getters }, context) {
        dispatch('todo/setUserData', context.$userStorage.getUserData());

        if (getters['todo/isLogged'] === true) {
            dispatch('todo/updateToken');
            dispatch('todo/updatePermissions', context.$userStorage);
            dispatch('todo/updateTodoGroups', context.$userStorage);
        }
    },
};
