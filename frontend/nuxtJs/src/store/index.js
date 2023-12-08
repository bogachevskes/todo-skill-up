export const actions = {
    nuxtClientInit({ dispatch, getters }, context) {
        dispatch('user/setUserData', context.$userStorage.getUserData());

        if (getters['user/isLogged'] === true) {
            dispatch('user/updateToken');
            dispatch('user/updatePermissions', context.$userStorage);
        }
    },
    nuxtServerInit({ dispatch, getters }, context) {
        dispatch('user/setUserData', context.$userStorage.getUserData());

        if (getters['user/isLogged'] === true) {
            dispatch('user/updateToken');
            dispatch('user/updatePermissions', context.$userStorage);
        }
    },
};
