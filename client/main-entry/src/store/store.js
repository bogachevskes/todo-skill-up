import Vue from 'vue';
import Vuex from 'vuex';

import router from './modules/router';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        token: null,
        userId: null,
        cards: [],
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
        setUserCards: function (state, cards) {
            state.cards = cards;
        },
    },
    actions: {
        setUserData: function ({commit}, userData) {
            commit('setUserState', userData);
        },
        setCards: function ({commit}, cards) {
            commit('setUserCards', cards);
        },
    },
    modules: {
        router: router,
    },
});