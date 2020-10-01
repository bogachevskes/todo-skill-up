import Vue from 'vue';
import App from './App.vue';

import VueRouter from 'vue-router';
import { routes } from '@router/routes';

import { store } from '@store/store';

import 'bulma/css/bulma.css';

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

new Vue({
    el: '#app',
    store: store,
    router: router,
    render: h => h(App),
});