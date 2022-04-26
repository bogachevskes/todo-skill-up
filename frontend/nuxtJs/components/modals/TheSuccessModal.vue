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
    import events from '@/constants/events';

    import { state, setters } from './traits/modal_defaults';
    
    export default {
        name: 'TheSuccessModal',
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
            
            this.$eventBus.$on(events.ON_SUCCESS, (heading, message) => {
                this.header = heading;
                this.message = message;
                this.showModal();

                return this;
            });
        }
    }
</script>