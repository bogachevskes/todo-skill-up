import Vue from 'vue';
import Vuex from 'vuex';

import router from './modules/router';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        token: null,
        userId: null,
        groups: [],
    },
    getters: {
        getToken: function (state) {
            return state.token;
        },
        notLogged: function (state) {
            return state.token === null || state.user_id === null
        },
        isLogged: function (_state, getters) {
            return ! getters.notLogged;
        }
    },
    mutations: {
        setUserState: function (state, userData) {
            state.token = userData.token;
            state.userId = userData.userId;
        },
        setUserGroups: function (state, groups) {
            state.groups = groups;
        },
    },
    actions: {
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
        }
    },
    modules: {
        router: router,
    },
});