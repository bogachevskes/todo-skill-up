<template>

    <div class="column is-6-tablet is-7-desktop is-8-widescreen is-hidden-mobile">
        <h1 class="subtitle is-2" v-if="(! showProjectLabel)">
            Создать план задач{{ period }}?
        </h1>
        <div v-if="showProjectLabel" class="is-hidden-mobile">
            <app-project-title></app-project-title>
        </div>
    </div>

</template>

<script>
    import ProjectTitle from '@common-components/ProjectTitle';
    import {eventBus} from '@store/eventBus';
    import events from '@config/events';
    
    export default {
        data: function () {
            return {
                period: null,
                periods: [
                    'день',
                    'месяц',
                    'год',
                    'бесконечность',
                ],
                showProjectLabel: false,
            };
        },
        methods: {
            hideIntro: function () {
                this.showProjectLabel = true;
                
                return this;
            },
            setPeriod: function () {
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
        mounted: function () {
            this.setPeriod();

            eventBus.$on(events.HIDE_INTRO, () => {
                this.hideIntro();

                return this;
            });

            return this;
        },
        components: {
            'app-project-title': ProjectTitle,
        },
    }
</script>