<template>
    
    <div class="column is-4">
        <nav class="panel">
            <p class="panel-heading has-background-primary has-text-primary-light">
                {{ group.status.name }}
            </p>
            <div class="panel-block has-background-light">
                <div class="container">
                    <div v-if="hasCards">
                        <card-item
                            v-for="(card, index) in group.todoes"
                            :key="index"
                            :card="card"
                            :deleteCard="deleteCard"
                            :editCard="editCard"
                        ></card-item>
                    </div>
                    <div v-if="hasNoCards">
                        Список пуст
                    </div>
                </div>
            </div>
        </nav>
    </div>

</template>

<script>

    import Card from './Card';

    export default {
        props: ['group', 'deleteCard', 'editCard'],
        components: {
            'card-item': Card,
        },
        computed: {
            hasCards: function () {
                return this.group.todoes.length > 0;
            },
            hasNoCards: function () {
                return ! this.hasCards;
            },
        },
        methods: {
            getGroups: function () {
                console.log(this.groups);
            },
        },
    }

</script>

<style>

</style>