export const state = () => ({
    token: null,
    userId: null,
    groups: [],
    permissions:[],
    todoAccessGroups: [],
});

export const getters = {
    getToken: function (state) {
        
        return state.token;
    },
    notLogged: function (state) {

        return state.token === null || state.user_id === null;
    },
    isLogged: function (_state, getters) {
        
        return getters.notLogged === false;
    },
    hasPermission: function (state, permissionName) {
        
        return state.permissions.includes(permissionName);
    },
    canManageUsers: function (state) {
        
        return state.permissions.includes('canManageUsers');
    },
    canManageUsersTodoes: function (state) {
        
        return state.permissions.includes('canManageUsersTodoes');
    },
}

export const mutations = {
    setUserState: function (state, userData) {
        state.token = userData.token;
        state.userId = userData.userId;
    },
    setUserGroups: function (state, groups) {
        state.groups = groups;
    },
    setUserPermissions: function (state, permissions) {
        state.permissions = permissions;
    },
    setUserTodoAccessGroups: function (state, groups) {
        state.todoAccessGroups = groups;
    },
};

export const actions = {
    setUserData: function ({commit}, userData) {
        commit('setUserState', userData);
    },
    setGroups: function ({commit}, groups) {
        commit('setUserGroups', groups);
    },
    updateGroupsList: function ({dispatch}, userStorage) {
        userStorage.loadTodoItems(() => {
            dispatch(
                    'setGroups',
                    userStorage.getTodoItems()
                );
        });
    },
    updateToken: function ({getters}) {

        this.$axios.defaults.headers.common['X-BASE-AUTH'] = getters.getToken;

    },
    updatePermissions: function ({commit}, userComponent) {
        userComponent.loadPermissions()
            .then(permissions => commit('setUserPermissions', permissions));
    },
    updateTodoAccessGroups: function ({commit}, userComponent) {
        userComponent.loadTodoAccessGroups()
            .then(groups => commit('setUserTodoAccessGroups', groups));
    },
};