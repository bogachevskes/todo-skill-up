import Vue from 'vue';
import Vuex from 'vuex';

import router from './modules/router';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        token: null,
        user_id: null,
    },
    getters: {
        notLogged: function (state) {
            return state.token === null || state.user_id === null
        },
        isLogged: function (_state, getters) {
            return ! getters.notLogged;
        }
    },
    mutations: {
        authUser: function (state, userData) {
            state.token = userData.token;
            state.user_id = userData.userId;
            
            localStorage.setItem('token', userData.token);
            localStorage.setItem('user_id', userData.userId);
        },
    },
    actions: {
        setUserData: function ({commit}, userData) {
            commit('authUser', userData);

            return this;
        }
    },
    modules: {
        router: router,
    },
});