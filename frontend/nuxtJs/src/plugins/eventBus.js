import Vue from 'vue';

import events from '@/constants/events';

const eventBus = {};

eventBus.install = function (Vue) {
    const config = {
        methods: {
            showSuccess (heading = 'Выполнено', message = '') {
                this.$emit(events.ON_SUCCESS, heading, message);
            },
            showError (
                heading = 'Ошибка',
                message = '',
                details = []
            ) {
                this.$emit(events.ON_ERROR, heading, message, details);
            },
            hideInviteIntro () {
                this.$emit(events.HIDE_INTRO);
            },
            showCardManageModal (formData, action) {
                this.$emit(events.SHOW_CARD_MANAGE_MODAL, formData, action);
            },
        },
    };

    Vue.prototype.$eventBus = new Vue(config);
};

Vue.use(eventBus);
