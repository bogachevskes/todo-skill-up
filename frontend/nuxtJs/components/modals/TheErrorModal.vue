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
                    <ul>
                        <li v-for="(detail, i) in details" :key="i">{{ detail }}</li>
                    </ul>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-danger" @click="hideModal()">Закрыть</button>
            </footer>
        </div>
    </div>
</template>

<script>
    import events from '@/constants/events';

    import { state, setters } from './traits/modal_defaults';
    
    export default {
        name: 'TheErrorModal',
        data: function() {
            return {
                ...state,
                details: [],
            };
        },
        methods: {
            ...setters,
            setErrorInfo: function (message = null, details = []) {

                this.message = message ? message : 'Сервис временно недоступен, повторите попытку позже';
                this.details = details;

                return this;
            },
            unsetModalInfo: function () {
                this.header = null;
                this.message = null;
                this.details = [];

                return this;
            },
        },
        mounted: function () {
            this.$eventBus.$on(events.ON_ERROR, (heading, message = null, details = []) => {
                this.header = heading;
                this.setErrorInfo(message, details)
                    .showModal();

                return this;
            });
        }
    }
</script>