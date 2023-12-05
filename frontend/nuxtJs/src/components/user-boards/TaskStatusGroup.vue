<template>
    <div class="column is-4">
        <nav class="panel">
            <p
                class="panel-heading has-background-primary has-text-primary-light"
                style="min-height: 60px"
            >
                {{ group.status.name }}
                <button
                    class="button is-success is-small ml-4"
                    v-if="canCreateTask === true"
                    @click="addTask(group.status)"
                >
                    Добавить задачу
                </button>
                <span class="is-pulled-right">
                    <button class="button is-warning is-small" @click="handleStatusUpdating(group.status)">
                        <b-icon icon="pencil" />
                    </button>
                    <button class="button is-danger is-small" @click="handleTaskStatusDelete(group.status)">
                        <b-icon icon="delete" />
                    </button>
                </span>
            </p>
            <div class="panel-block has-background-light">
                <div class="container">
                    <div
                        @drop="moveTask ? moveTask($event, group.status) : null"
                        @dragover.prevent
                        @dragenter.prevent
                    >
                        <div v-if="hasCards">
                            <Task
                                v-for="(task, index) in group.tasks"
                                :key="index"
                                :statuses="statuses"
                                :task="task"
                                :change-status="changeStatus"
                                :on-move-task="onMoveTask"
                                :delete-task="deleteTask"
                                :edit-task="editTask"
                            />
                        </div>
                        <div
                            v-if="hasCards === false"
                            style="
                                display: flex;
                                align-items: center;
                                min-height: 50px;
                            "
                        >
                            Нет задач
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
import Task from './Task';

import TaskStatusGroup from '@/plugins/models/TaskStatusGroup';

export default {
    components: {
        Task,
    },
    props: {
        handleStatusUpdating: {
            type: Function,
        },
        handleTaskStatusDelete: {
            type: Function,
        },
        group: {
            type: TaskStatusGroup,
        },
        statuses: {
            type: Array,
            default: null,
        },
        addTask: {
            type: Function,
            default: null,
        },
        canCreateTask: {
            type: Boolean,
        },
        changeStatus: {
            type: Function,
            default: null,
        },
        onMoveTask: {
            type: Function,
            default: null,
        },
        moveTask: {
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
    computed: {
        hasCards () {
            return this.group.tasks.length > 0;
        },
    },
};
</script>

<style></style>
