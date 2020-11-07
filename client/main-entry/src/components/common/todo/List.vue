<template>
      <section class="hero is-info is-fullheight" style="min-height:600px;">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-vcentered">
                    <card-item
                        v-for="(card, index) in cards"
                        :key="index"
                        :card="card"
                    ></card-item>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import Card from './list/Card';

    import { mapState } from 'vuex';

    export default {
        computed: {
            ...mapState([
                'cards',
            ]),
        },
        components: {
            'card-item': Card,
        },
        beforeCreate: function () {
            this.$userStorage.loadTodoItems(() => {
                this.$store.dispatch(
                        'setCards',
                        this.$userStorage.getTodoItems()
                    );
            });
        },
    }
</script>