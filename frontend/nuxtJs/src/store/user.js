export const state = () => ({
    token: null,
    userId: null,
    groups: [],
    permissions: [],
});

export const getters = {
    getUserId(state) {
        return state.userId;
    },
    getToken(state) {
        return state.token;
    },
    notLogged(state) {
        return state.token === null || state.user_id === null;
    },
    isLogged(_state, getters) {
        return getters.notLogged === false;
    },
    getPermissions(state) {
        return state.permissions;
    },
};

export const mutations = {
    setUserState(state, userData) {
        state.token = userData.token;
        state.userId = userData.userId;
    },
    setUserGroups(state, groups) {
        state.groups = groups;
    },
    setUserPermissions(state, permissions) {
        state.permissions = permissions;
    },
};

export const actions = {
    setUserData ({ commit }, userData) {
        commit('setUserState', userData);
    },
    setGroups ({ commit }, groups) {
        commit('setUserGroups', groups);
    },
    updateToken({ getters }) {
        this.$axios.defaults.headers.common['X-BASE-AUTH'] = getters.getToken;
    },
    updatePermissions({ commit }, userComponent) {
        userComponent
            .loadPermissions()
            .then((permissions) => commit('setUserPermissions', permissions));
    },
};
