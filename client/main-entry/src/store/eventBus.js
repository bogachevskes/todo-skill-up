import Vue from 'vue';

import events from '@config/events';

export const eventBus = new Vue({
    methods: {
        showSuccess: function (heading = 'Выполнено', message = '') {
            this.$emit(events.ON_SUCCESS, heading, message);

            return this;
        },
        showError: function (params, heading = 'Ошибка') {
            this.$emit(events.ON_ERROR, params, heading);

            return this;
        },
        hideInviteIntro: function() {
            this.$emit(events.HIDE_INTRO);

            return this;
        }
    },
});