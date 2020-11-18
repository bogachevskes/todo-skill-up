import Vue from 'vue';

import events from '@config/events';

export const eventBus = new Vue({
    methods: {
        showSuccess: function (heading = 'Выполнено', message = '') {
            this.$emit(events.ON_SUCCESS, heading, message);
        },
        showError: function (params, heading = 'Ошибка') {
            this.$emit(events.ON_ERROR, params, heading);
        },
        hideInviteIntro: function() {
            this.$emit(events.HIDE_INTRO);
        },
        showCardManageModal: function (formData, actionName) {
            this.$emit(events.SHOW_CARD_MANAGE_MODAL, formData, actionName);
        },
    },
});