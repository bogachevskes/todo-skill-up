<template>
    <div
        class="column is-6-tablet is-7-desktop is-8-widescreen is-hidden-mobile"
    >
        <h1 v-if="!showProjectLabel" class="subtitle is-2">
            Создать план задач{{ period }}?
        </h1>
        <div v-if="showProjectLabel" class="is-hidden-mobile">
            <TheProjectTitle />
        </div>
    </div>
</template>

<script>
import TheProjectTitle from '../TheProjectTitle';

import events from '@/constants/events';

export default {
    components: {
        TheProjectTitle,
    },
    data () {
        return {
            period: null,
            periods: ['день', 'месяц', 'год', 'бесконечность'],
            showProjectLabel: false,
        };
    },
    mounted () {
        this.setPeriod();

        this.$eventBus.$on(events.HIDE_INTRO, () => {
            this.hideIntro();

            return this;
        });

        return this;
    },
    methods: {
        hideIntro () {
            this.showProjectLabel = true;

            return this;
        },
        setPeriod () {
            let counter = 0;

            const periodInterval = setInterval(() => {
                this.period = ' на ' + this.periods[counter];

                counter++;

                if (counter > this.periods.length) {
                    clearInterval(periodInterval);
                    this.hideIntro();
                }

                if (this.showProjectLabel) {
                    clearInterval(periodInterval);
                }
            }, 2000);
        },
    },
};
</script>
