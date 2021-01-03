<template>
    
    <div class="column is-4">
        <nav class="panel">
            <p class="panel-heading has-background-primary has-text-primary-light" >
                {{ group.status.name }}
                <button class='button is-warning is-small ml-4' v-if="(addCard && group.isInitialDefault())" @click="addCard">Добавить задачу</button>
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

    import TodoGroup from '@models/TodoGroup';

    export default {
        props: {
            group: {
                type: TodoGroup,
            },
            addCard: {
                type: Function,
                default: null,
            },
            deleteCard: {
                type: Function,
                default: null,
            },
            editCard: {
                type: Function,
                default: null,
            },
        },
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
    }

</script>

<style>

</style>