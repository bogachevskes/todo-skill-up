<template>
    <div class="column is-4">
        <nav class="panel">
            <p
                class="panel-heading has-background-primary has-text-primary-light"
                style="min-height: 60px"
            >
                {{ group.status.name }}
                <button
                    v-if="addCard && group.isInitialDefault()"
                    class="button is-warning is-small ml-4"
                    @click="addCard"
                >
                    Добавить задачу
                </button>
            </p>
            <div class="panel-block has-background-light">
                <div class="container">
                    <div
                        @drop="moveCard ? moveCard($event, group) : null"
                        @dragover.prevent
                        @dragenter.prevent
                    >
                        <div v-if="hasCards">
                            <Card
                                v-for="(card, index) in group.todo"
                                :key="index"
                                :statuses="statuses"
                                :card="card"
                                :change-status="changeStatus"
                                :on-move-card="onMoveCard"
                                :delete-card="deleteCard"
                                :edit-card="
                                    group.isInitialDefault() ? editCard : null
                                "
                            />
                        </div>
                        <div
                            v-if="hasNoCards"
                            style="
                                display: flex;
                                align-items: center;
                                min-height: 50px;
                            "
                        >
                            Список пуст
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
import Card from './Card';

import TodoGroup from '@/plugins/models/TodoGroup';

export default {
    components: {
        Card,
    },
    props: {
        group: {
            type: TodoGroup,
        },
        statuses: {
            type: Array,
            default: null,
        },
        addCard: {
            type: Function,
            default: null,
        },
        changeStatus: {
            type: Function,
            default: null,
        },
        onMoveCard: {
            type: Function,
            default: null,
        },
        moveCard: {
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
    computed: {
        hasCards () {
            return this.group.todo.length > 0;
        },
        hasNoCards () {
            return !this.hasCards;
        },
    },
};
</script>

<style></style>
