<template>

    <div class="py-2">
        <div class="card">
            <div class="card-content">
                <p class="title" style="color:black">
                    {{card.name}}
                </p>
                <p class="subtitle" style="color:black">
                    <u>Описание:</u><br>
                    {{ card.printDescription() }}
                </p>
                <div class="content">
                    Плановая дата выполнения:<br>{{ card.printPlannedCompilationAt() }}
                    <br>
                    Создано:<br>{{ card.printCreatedAt() }}
                </div>
            </div>
            <footer class="card-footer">
                <p
                    v-if="deleteCard"
                    class="card-footer-item"
                >
                    <span
                        class="button is-warning"
                        @click="editCard(card)">
                        Изменить
                    </span>
                </p>
                <p
                    v-if="deleteCard"
                    class="card-footer-item"
                >
                    <span
                        class="button is-danger"
                        @click="deleteCard(card.id)">
                        Удалить
                    </span>
                </p>
            </footer>
        </div>
    </div>

</template>

<script>

    import TodoItem from '@models/TodoItem';

    export default {
        props: {
            card: {
                type: TodoItem,
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
    }

</script>

<style>

</style>