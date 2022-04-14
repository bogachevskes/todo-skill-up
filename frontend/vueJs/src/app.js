import Vue from 'vue';
import App from './App.vue';

import VueRouter from 'vue-router';
import { routes } from '@router/routes';

import { store } from '@store/store';

import userStorageService from '@services/UserStorageService';

import MixinLoader from '@helpers/MixinLoader';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: routes,
    mode: 'history',
    scrollBehavior: function (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        
        if (to.hash) {
            return {
                selector: to.hash,
            }
        }
    },
});

/** middleware */
router.beforeEach((to, from, next) => {
    next();
});

const mixins = {
    userStorage: userStorageService.getInstance(),
};

MixinLoader.load(mixins);
  
new Vue({
    el: '#app',
    store: store,
    router: router,
    userStorage: mixins.userStorage,
    render: h => h(App),
    created: function () {
        this.$store.dispatch('setUserData', this.$userStorage.getUserData());

        if (this.$store.getters.isLogged) {
            this.$store.dispatch('updateToken');
            this.$store.dispatch('updatePermissions', this.$userStorage);
            this.$store.dispatch('updateTodoAccessGroups', this.$userStorage);
        }

    },
});