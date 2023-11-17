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
                    <ul>
                        <li v-for="(detail, i) in details" :key="i">
                            {{ detail }}
                        </li>
                    </ul>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-danger" @click="hideModal()">
                    Закрыть
                </button>
            </footer>
        </div>
    </div>
</template>

<script>
import { state, setters } from './traits/modal_defaults';
import events from '@/constants/events';


export default {
    name: 'TheErrorModal',
    data () {
        return {
            ...state,
            details: [],
        };
    },
    mounted () {
        this.$eventBus.$on(
            events.ON_ERROR,
            (heading, message = null, details = []) => {
                this.header = heading;
                this.setErrorInfo(message, details).showModal();

                return this;
            }
        );
    },
    methods: {
        ...setters,
        setErrorInfo (message = null, details = []) {
            this.message = message || 'Сервис временно недоступен, повторите попытку позже';
            this.details = details;

            return this;
        },
        unsetModalInfo () {
            this.header = null;
            this.message = null;
            this.details = [];

            return this;
        },
    },
};
</script>
