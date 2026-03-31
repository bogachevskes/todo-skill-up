<template>
    <section>
        <div class="notices is-top">
            <b-notification
                position="is-top-right"
                auto-close
                :progress-bar='progressBar'
                :duration="duration"
                title="Error!"
                :type="type"
                has-icon
                v-model="isActive"
                aria-close-label="Close notification">
                {{ text }}
            </b-notification>
        </div>
    </section>
</template>

<script>
    import events from '@/constants/events';

    export default {
        data() {
            return {
                isActive: false,
                duration: 5000,
                progressBar: true,
                type: 'is-success',
                text: null,
                notificationsQueue: [],
                isQueueProcessing: false,
            }
        },
        mounted() {

            this.$eventBus.$on(events.ON_NEW_NOTIFICATION, (text, type = 'success') => {

                const task = {
                        isActive: true,
                        text,
                        type: `is-${type}`,
                    };

                this.notificationsQueue.push(task);

                if (this.isQueueProcessing === false) {

                    this.isQueueProcessing = true;

                    this.startQueue();

                }

            });
        },
        methods: {
            runTask: function (task) {

                for (const prop in task) {
                    this[prop] = task[prop];
                }

            },
            touchQueue: function () {
                if (this.isActive === true) {

                    return;
                }

                this.runTask(this.notificationsQueue[0]);
                this.notificationsQueue.shift();

            },
            startQueue: function () {

                const tickInterval = setInterval(() => {

                    if (this.notificationsQueue.length === 0) {
                        clearInterval(tickInterval);

                        this.isQueueProcessing = false;

                    }

                    this.touchQueue();

                }, 1000);

            }
        },
    }
</script>
