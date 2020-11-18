<template>
      <section class="hero is-info is-fullheight" style="min-height:600px;">
        <div class="hero-body">
            <div class="container">
                <manage-card-item></manage-card-item>
                <div class="columns">
                    <div class="column is-3 has-background-white">
                        <aside class="menu">
                            <p class="menu-label">
                                Возможности
                            </p>
                            <ul class="menu-list">
                                <li class="is-right">
                                    <a class="is-active" @click="addCard">Добавить задачу</a>
                                </li>
                            </ul>
                        </aside>
                    </div>
                </div>
                <div class="columns is-vcentered">
                    <card-item
                        v-for="(card, index) in cards"
                        :key="index"
                        :card="card"
                        :deleteCard="deleteCard"
                    ></card-item>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import Card from './list/Card';
    import ManageCard from './list/ManageCard';

    import axios from '@axios/base';
    import { mapState } from 'vuex';

    import { eventBus } from '@store/eventBus';

    import TodoItem from '@models/TodoItem';

    export default {
        computed: {
            ...mapState([
                'cards',
            ]),
        },
        components: {
            'card-item': Card,
            'manage-card-item': ManageCard,
        },
        methods: {
            deleteCard: function (id) {
                axios.delete('todo/delete', { data: { id } })
                    .then(() => {
                        this.$store.dispatch('updateCardsList', this.$userStorage);
                    });
            },
            addCard: function () {
                eventBus.showCardManageModal(
                        TodoItem.getInstance(),
                        'Добавить задачу'
                    );
            },
        },
        beforeCreate: function () {
            this.$store.dispatch('updateCardsList', this.$userStorage);
        },
    }
</script>