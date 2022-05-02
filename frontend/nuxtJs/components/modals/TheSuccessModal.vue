<template>
    <div class="modal" :class="{ 'is-active': isActive }">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">{{ header }}</p>
                <button
                    class="delete"
                    aria-label="close"
                    @click="hideModal()"
                ></button>
            </header>
            <section class="modal-card-body has-text-danger">
                <div class="content">
                    <h6>{{ message }}</h6>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success" @click="hideModal()">
                    Хорошо
                </button>
            </footer>
        </div>
    </div>
</template>

<script>
import { state, setters } from './traits/modal_defaults';
import events from '@/constants/events';


export default {
    name: 'TheSuccessModal',
    data () {
        return {
            ...state,
        };
    },
    mounted () {
        this.$eventBus.$on(events.ON_SUCCESS, (heading, message) => {
            this.header = heading;
            this.message = message;
            this.showModal();

            return this;
        });
    },
    methods: {
        ...setters,
        unsetModalInfo () {
            this.header = null;
            this.message = null;

            return this;
        },
    },
};
</script>
