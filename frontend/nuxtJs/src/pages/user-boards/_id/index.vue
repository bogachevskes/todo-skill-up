<template>
    <section class="hero is-info is-fullheight" style="min-height: 600px">
        <div class="hero-body">
            <div class="container is-marginless">

                <div class="modal" :class="{ 'is-active': taskStatusGroupModal.isActive }">
                    <div class="modal-background"></div>
                    <div class="modal-card">
                        <header class="modal-card-head">
                            <p class="modal-card-title">Добавить статус</p>
                            <button
                                class="delete"
                                aria-label="close"
                                @click="taskStatusGroupModal.isActive = false"
                            ></button>
                        </header>
                        <section class="modal-card-body">
                            <div class="field">
                                <label class="label">Название</label>
                                <div class="control">
                                    <input
                                        v-model="formData.name"
                                        class="input"
                                        placeholder="Анализ"
                                        @blur="blurField(['formData', 'name'])"
                                    />
                                </div>
                                <p
                                    v-if="
                                $v.formData.name.$dirty &&
                                !$v.formData.name.required
                            "
                                    class="help is-danger"
                                >
                                    Обязательно к заполнению
                                </p>
                                <p
                                    v-if="
                                $v.formData.name.$error &&
                                $v.formData.name.required
                            "
                                    class="help is-danger"
                                >
                                    Минимальное кол-во символов: {{ lengthRules.name }}
                                </p>
                            </div>
                        </section>
                        <footer class="modal-card-foot">
                            <button
                                class="button is-success"
                                :disabled="$v.$invalid"
                                @click="handleStatusProcessing"
                            >
                                Сохранить
                            </button>
                            <button class="button is-danger" @click="taskStatusGroupModal.isActive = false">
                                Отменить
                            </button>
                        </footer>
                    </div>
                </div>

                <div class="columns mt-1">
                    <div class="column is-4">
                        <h1 class="title is-size-1">Задачи</h1>
                        <a href="/" type="button" class="button is-warning">К списку досок</a>
                        <button class="button is-success ml-2" @click="handleStatusAdding">Добавить статус</button>
                    </div>
                    <div class="column is-4">
                        <div class="box">
                            <div class="columns">
                                <div class="column is-6">
                                    <h3>Доска</h3>
                                    <h4>{{board.name}}</h4>
                                    <h5>{{ board.description }}</h5>
                                </div>
                                <div class="column is-6">
                                    Создал
                                    <br>
                                    Не задано
                                    <br>
                                    {{ getDate(board.createdAt) }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="column is-4">
                        <ManageUsers :users="users" :load-users="loadUsers" />
                    </div>
                </div>
                <ManageTasks :load-task-status-groups="loadTaskStatusGroups" />
                <div class="columns" style="overflow-y: auto">
                    <TaskStatusGroup
                        v-for="(group, index) in taskStatusGroups"
                        :key="index"
                        :can-create-task="index === 0"
                        :group="group"
                        :statuses="statuses"
                        :add-task="addTask"
                        :change-status="changeStatus"
                        :on-move-task="onMoveTask"
                        :move-task="moveTask"
                        :delete-task="deleteTask"
                        :edit-task="editTask"
                        :handleStatusUpdating="handleStatusUpdating"
                        :handleTaskStatusDelete="handleTaskStatusDelete"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script>

    import events from '@/constants/events';
    import { required, minLength } from 'vuelidate/lib/validators';
    import { inputMethods, validationMixinAsset } from '@/libs/libStack';
    import Board from "@/plugins/models/Board";
    import DateHelper from '@/plugins/helpers/DateHelper';
    import { mapGetters } from "vuex";
    import ManageUsers from "@/components/user-boards/ManageUsers";
    import TaskStatusGroup from "@/components/user-boards/TaskStatusGroup";
    import ManageTasks from "@/components/user-boards/ManageTasks";
    import Task from "@/plugins/models/Task";
    import TaskStatusGroupFactory from "@/plugins/services/TaskStatusGroupFactory";
    import TaskStatus from "@/plugins/models/TaskStatus";
    import TasksFactory from "@/plugins/services/TasksFactory";

    export default {
        name: 'BoardTasks',
        mixins: [validationMixinAsset],
        components: {
            ManageUsers,
            TaskStatusGroup,
            ManageTasks,
        },
        beforeRouteLeave (_to, _from, next) {

            this.clearIntervals();

            if (this.socket !== null) {

                this.socket.emit('leave_board', {board: this.$route.params.id});

                this.$socketClient.detachConnection('board');
            }

            next();
        },
        data() {
            return {
                board: { },
                users: [],
                taskStatusGroups: [],
                statuses: [],
                taskStatusGroupModal: {
                    isActive: null,
                    action: 'create',
                },
                lengthRules: {
                    name: 5,
                    description: 10,
                },
                formData: {},
                intervals: [],
                socket: null,
            };
        },
        computed: {
            ...mapGetters('user', ['getUserId']),
        },
        methods: {
            ...inputMethods,
            loadBoard() {
                this.$axios
                    .$get(`/user/${this.getUserId}/boards/${this.$route.params.id}`)
                    .then((board) => {
                        this.board = new Board(board);
                    });
            },
            loadUsers() {
                this.$axios
                    .$get(`/boards/${this.$route.params.id}/users`)
                    .then((users) => {
                        this.users = users;
                    });
            },
            loadTaskStatusGroups() {
                this.$axios
                    .$get(`/boards/${this.$route.params.id}/tasks`)
                    .then((groups) => {
                        this.statuses = [];

                        const factory = new TaskStatusGroupFactory();

                        this.taskStatusGroups = factory.make(groups);

                        for (const taskStatusGroup of this.taskStatusGroups) {

                            this.statuses.push(new TaskStatus(taskStatusGroup.status));
                        }
                    });
            },
            getDate(date) {
                return DateHelper.format(date, 'DD.MM.YYYY HH:mm');
            },
            addTask(status) {
                const task = new Task({statusId: status.id});

                this.$eventBus.showCardManageModal(
                    task,
                    'create'
                );
            },
            moveToGroup(taskId, statusId) {
                this.$axios
                    .$patch(
                        `/boards/${this.$route.params.id}/tasks/${taskId}`,
                        { formData: {statusId} }
                    )
                    .then(() => {
                        this.loadTaskStatusGroups();
                    });
            },
            changeStatus(task, event) {
                this.moveToGroup(task.id, event.target.value);
            },
            onMoveTask(event, task) {
                event.dataTransfer.dropEffect = 'move';
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('task_id', task.id);
            },
            moveTask(event, taskStatus) {

                const cardId = event.dataTransfer.getData('task_id');

                this.moveToGroup(cardId, taskStatus.id);
            },
            deleteTask(id) {
                this.$axios
                    .$delete(
                        `/boards/${this.$route.params.id}/tasks/${id}`
                    )
                    .then(() => {
                        this.loadTaskStatusGroups();
                    });
            },
            editTask(card) {
                this.$eventBus.showCardManageModal(card, 'update');
            },
            handleStatusAdding() {
                this.taskStatusGroupModal.isActive = true;
                this.taskStatusGroupModal.action = 'create';
            },
            handleStatusUpdating(status) {
                this.formData = {...status};
                this.taskStatusGroupModal.isActive = true;
                this.taskStatusGroupModal.action = 'update';
            },
            flushFormData() {
                for (const item in this.formData) {
                    this.formData[item] = null;
                }
            },
            onStatusProcessingComplete() {
                this.taskStatusGroupModal.isActive = false;
                this.$v.$reset();
                this.flushFormData();
                this.loadTaskStatusGroups();
            },
            executeCreation() {
                this.$axios
                    .$post(
                        `/boards/${this.$route.params.id}/statuses`,
                        { formData: {...this.formData} }
                    )
                    .then((res) => this.onStatusProcessingComplete());
            },
            executeUpdating() {

                this.$axios
                    .$put(
                        `/boards/${this.$route.params.id}/statuses/${this.formData.id}`,
                        { formData: {...this.formData} }
                    )
                    .then((res) => this.onStatusProcessingComplete());
            },
            handleStatusProcessing() {
                const actions = {
                    'create': 'executeCreation',
                    'update': 'executeUpdating',
                };

                if (actions.hasOwnProperty(this.taskStatusGroupModal.action)) {

                    return this[actions[this.taskStatusGroupModal.action]]();
                }

                throw new Error('Обработчик задания не определен');
            },
            handleTaskStatusDelete(status) {
                this.$axios
                    .$delete(
                        `/boards/${this.$route.params.id}/statuses/${status.id}`
                    )
                    .then(() => {
                        this.loadTaskStatusGroups();
                    });
            },
            clearIntervals() {

                this.intervals.forEach((interval) => {

                    clearInterval(interval);
                });
            },
            moveCardToListBottom(task) {
                for (const group of this.taskStatusGroups) {
                    if (Number(group.status.id) !== Number(task.statusId)) {
                        continue;
                    }

                    group.tasks.push(task);

                    break;
                }
            },
            removeTaskFromCurrentList(entity) {
                for (const group of this.taskStatusGroups) {

                    const task = group.tasks.find((task) => {
                        return Number(task.id) === Number(entity.id);
                    });

                    if (task === undefined) {
                        continue;
                    }

                    group.tasks = group.tasks.filter((task) => {
                        return Number(task.id) !== Number(entity.id);
                    });
                }
            },
            initWsListeners() {
                const listeners = {
                    connection_ready: () => {

                        this.$eventBus.$emit(events.ON_NEW_NOTIFICATION, 'Установлено соединение для общего доступа');
                    },
                    ws_error: (msg) => {

                        const authErrors = [
                            'NotFoundException',
                            'ForbiddenException',
                            'JsonWebTokenError',
                        ];

                        if (authErrors.includes(msg.type)) {
                            this.$eventBus.$emit(events.ON_NEW_NOTIFICATION, 'Ошибка аутентификации', 'danger');
                            this.socket.close();
                            return;
                        }

                        this.$eventBus.$emit(events.ON_NEW_NOTIFICATION, 'Непредвиденная ошибка', 'danger');
                        this.socket.close();
                    },
                    'task-created': (entity) => {

                        const task = (new TasksFactory).make([entity])[0];

                        this.moveCardToListBottom(task);
                    },
                    'task-state-changed': (entity) => {

                        this.removeTaskFromCurrentList(entity);

                        const newGroup = this.taskStatusGroups.find((group) => {
                            return Number(group.status.id) === entity.statusId;
                        });

                        const task = (new TasksFactory).make([entity])[0];

                        newGroup.tasks = [task].concat(newGroup.tasks);

                    },
                    'task-deleted': this.removeTaskFromCurrentList,
                };

                for (const listener in listeners) {

                    if (this.socket.hasListeners('error') === false) {
                        this.socket.on(listener, listeners[listener]);
                    }
                }
            },
            initWsConnection() {

                if (Boolean(process.client) === false) {

                    return;
                }

                if (this.$socketClient.hasConnection('board') === false) {

                    const socket = this.$socketClient
                        .create({
                            transports: ['websocket'],
                            path: '/ws-board',
                            query: {
                                token: this.$store.getters['user/getToken'],
                            },
                        }, '/board');

                    this.$socketClient.addConnection('board', socket);
                }

                this.socket = this.$socketClient.getConnection('board');

                this.initWsListeners();

                if (this.socket.hasListeners('error') === false) {

                    this.socket.io.on('error', () => {
                        this.$eventBus.$emit(events.ON_NEW_NOTIFICATION, 'Ошибка соединения общего доступа', 'danger');
                    });

                }

                this.socket.emit('join_board', {board: this.$route.params.id});

            },
        },

        mounted() {
            this.loadBoard();
            this.loadTaskStatusGroups();
            this.loadUsers();
            this.initWsConnection();
        },
        validations() {
            return {
                formData: {
                    name: {
                        required,
                        minLength: minLength(this.lengthRules.name),
                    },
                },
            };
        },
    }
</script>

<style scoped>

</style>
