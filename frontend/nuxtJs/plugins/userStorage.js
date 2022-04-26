import Vue from 'vue';
import UserStorageService from './services/UserStorageService';

const userStorage = {};

userStorage.install = function (Vue) {

    Vue.prototype.$userStorage = UserStorageService.getInstance();

    Vue.prototype.$userStorage.axios = Vue.$axios;
}

Vue.use(userStorage);