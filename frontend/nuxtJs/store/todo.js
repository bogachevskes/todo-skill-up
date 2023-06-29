export const state = () => ({
    token: null,
    userId: null,
    groups: [],
    permissions: [],
    todoGroups: [],
});

export const getters = {
    getToken (state) {
        return state.token;
    },
    notLogged (state) {
        return state.token === null || state.user_id === null;
    },
    isLogged (_state, getters) {
        return getters.notLogged === false;
    },
    hasPermission (state, permissionName) {
        return state.permissions.includes(permissionName);
    },
    canManageUsers (state) {
        return state.permissions.includes('/admin/users');
    },
    canManageUsersTodo (state) {
        return state.permissions.includes('/admin/users/todo');
    },
};

export const mutations = {
    setUserState (state, userData) {
        state.token = userData.token;
        state.userId = userData.userId;
    },
    setUserGroups (state, groups) {
        state.groups = groups;
    },
    setUserPermissions (state, permissions) {
        state.permissions = permissions;
    },
    setUserTodoGroups (state, groups) {
        state.todoGroups = groups;
    },
};

export const actions = {
    setUserData ({ commit }, userData) {
        commit('setUserState', userData);
    },
    setGroups ({ commit }, groups) {
        commit('setUserGroups', groups);
    },
    updateGroupsList ({ dispatch }, userStorage) {
        userStorage.loadTodoItems(() => {
            dispatch('setGroups', userStorage.getTodoItems());
        });
    },
    updateToken ({ getters }) {
        this.$axios.defaults.headers.common['X-BASE-AUTH'] = getters.getToken;
    },
    updatePermissions ({ commit }, userComponent) {
        userComponent
            .loadPermissions()
            .then((permissions) => commit('setUserPermissions', permissions));
    },
    updateTodoGroups ({ commit }, userComponent) {
        userComponent
            .loadTodoGroups()
            .then((groups) => commit('setUserTodoGroups', groups));
    },
};
