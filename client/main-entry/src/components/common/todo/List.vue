<template>
      <section class="hero is-info is-fullheight" style="min-height:600px;">
        <div class="hero-body">
            <div class="container">
                <create-card-item></create-card-item>
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
    import CreateCard from './list/CreateCard';

    import axios from '@axios/base';
    import { mapState } from 'vuex';

    export default {
        computed: {
            ...mapState([
                'cards',
            ]),
        },
        components: {
            'card-item': Card,
            'create-card-item': CreateCard,
        },
        methods: {
            deleteCard: function (id) {
                console.log(id);
                axios.delete('todo/delete', { data: { id } })
                    .then(() => {
                        this.$store.dispatch('updateCardsList', this.$userStorage);
                    });
            }
        },
        beforeCreate: function () {
            this.$store.dispatch('updateCardsList', this.$userStorage);
        },
    }
</script>