<template>
    <div class="modal" :class="{ 'is-active': isActive }">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">{{ header }}</p>
                <button class="delete" aria-label="close" @click="hideModal()"></button>
            </header>
            <section class="modal-card-body has-text-danger">
                <div class="content">
                    <h6>{{ message }}</h6>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success" @click="hideModal()">Хорошо</button>
            </footer>
        </div>
    </div>
</template>

<script>
    import {eventBus} from '@store/eventBus';
    import events from '@config/events';

    import { state, setters } from '@common-traits/modal_defaults';
    
    export default {
        data: function() {
            return {
                ...state,
            };
        },
        methods: {
            ...setters,
            unsetModalInfo: function () {
                this.header = null;
                this.message = null;

                return this;
            },
        },
        mounted: function () {
            eventBus.$on(events.ON_SUCCESS, (heading, message) => {
                this.header = heading;
                this.message = message;
                this.showModal();

                return this;
            });
        }
    }
</script>