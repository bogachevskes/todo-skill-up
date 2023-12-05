<template>
    <div
        class="py-2"
        draggable="true"
        @dragstart="onMoveTask ? onMoveTask($event, task) : null"
    >
        <div class="card">
            <div class="card-content p-4">
                <div class="title" style="color: black">
                    {{ task.name }}
                </div>
                <div class="subtitle mb-1" style="color: black">
                    {{ task.printDescription() }}
                </div>
                <div class="content">
                    Плановая дата выполнения: {{
                        task.printPlannedCompilationAt()
                    }}
                    <br />
                    Создано: {{ task.printCreatedAt() }}
                </div>
            </div>
            <footer class="card-footer">
                <p class="card-footer-item">
                    <span class="select is-success is-small">
                        <select @change="changeStatus(task, $event)">
                            <option
                                v-for="(status, index) in statuses"
                                :key="index"
                                :value="status.id"
                                :selected="Number(task.statusId) === Number(status.id)"
                            >
                                {{ status.name }}
                            </option>
                        </select>
                    </span>
                </p>
                <p v-if="editTask" class="card-footer-item">
                    <span class="button is-warning is-small" @click="editTask(task)">
                        Изменить
                    </span>
                </p>
                <p v-if="deleteTask" class="card-footer-item">
                    <span class="button is-danger is-small" @click="deleteTask(task.id)">
                        Удалить
                    </span>
                </p>
            </footer>
        </div>
    </div>
</template>

<script>
import Task from '@/plugins/models/Task';

export default {
    props: {
        statuses: {
            type: Array,
            default: null,
        },
        task: {
            type: Task,
        },
        changeStatus: {
            type: Function,
            default: null,
        },
        onMoveTask: {
            type: Function,
            default: null,
        },
        deleteTask: {
            type: Function,
            default: null,
        },
        editTask: {
            type: Function,
            default: null,
        },
    },
};
</script>
