import Vue from 'vue';
import Vuex from 'vuex';

import router from './modules/router';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        token: null,
        user_id: null,
        userData: null,
    },
    getters: {

    },
    mutations: {
        authUser: function (state, userData) {
            state.token = userData.token;
            state.user_id = userData.userId;
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