<template>
    <div class="column is-10">
        <div class="section has-background-info" style="padding: 20px">
            <div class="columns mt-1">
                <div class="column is-6">
                    <div class="box">
                        <div style="display: inline-block">
                            {{ group.description }}
                            <br />
                            Создал
                            <span class="tag is-primary is-medium">
                                {{ group.user_name }} ({{
                                    getDate(group.createdAt)
                                }})
                            </span>
                        </div>
                        <div
                            v-if="
                                Number(group.user_id) ===
                                $userStorage.getUserId()
                            "
                            class="is-pulled-right"
                            style="
                                display: inline-block;
                                vertical-align: top;
                                margin-top: 8px;
                            "
                        >
                            <button
                                class="button is-warning"
                                @click="
                                    modals.updateTodoGroup.isActive = true
                                "
                            >
                                Изменить
                            </button>
                            <button
                                class="button is-danger"
                                @click="deleteGroup()"
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
                <div class="column is-6">
                    <ManageUsers :users="users" :load-users="loadUsers" />
                </div>
            </div>
            <ManageCard :load-todo-groups="loadTodoGroups" />
            <div class="columns mt-1">
                <Group
                    v-for="(group, index) in groups"
                    :key="index"
                    :group="group"
                    :statuses="statuses"
                    :add-card="addCard"
                    :change-status="changeStatus"
                    :on-move-card="onMoveCard"
                    :move-card="moveCard"
                    :delete-card="deleteCard"
                    :edit-card="editCard"
                />
            </div>
        </div>
        <GroupsActionsModal
            :mode="'update'"
            :group-id="group.id"
            :modal="modals.updateTodoGroup"
            :before-action="fillForm"
            :after-action="loadGroupData"
        />
    </div>
</template>

<script>

import events from '@/constants/events';

import Group from '@/components/todo-group/Group';
import ManageCard from '@/components/todo-group/ManageCard';
import ManageUsers from '@/components/todo-group/ManageUsers';
import GroupsActionsModal from '@/components/left-side-bar/GroupsActionsModal';

import TodoItem from '@/plugins/models/TodoItem';
import TodoGroupsService from '@/plugins/services/TodoGroupsService';
import TodoItemService from '@/plugins/services/TodoItemService';
import DateHelper from '@/plugins/helpers/DateHelper';

export default {
    components: {
        Group,
        ManageCard,
        ManageUsers,
        GroupsActionsModal,
    },
    beforeRouteLeave (_to, _from, next) {

        this.clearIntervals();

        if (this.socket !== null) {

            this.$socketClient.detachConnection('todo_access_group');
        }

        next();
    },
    beforeRouteUpdate (_to, _from, next) {
        this.loadGroupData();
        this.loadTodoGroups();
        this.loadUsers();
        this.clearIntervals();

        if (this.currentGroupId !== null) {
            this.socket.emit('leave_access_group', {group: this.currentGroupId});
        }

        next();
    },
    layout: 'desk',
    data () {
        return {
            currentGroupId: null,
            socket: null,
            group: [],
            groups: [],
            statuses: [],
            users: [],
            intervals: [],
            modals: {
                updateTodoGroup: {
                    isActive: false,
                },
            },
        };
    },
    computed: {},
    mounted () {
        this.loadGroupData();
        this.loadTodoGroups();
        this.loadUsers();
        this.initWsConnection();
    },
    methods: {
        getDate (date) {
            return DateHelper.format(date, 'DD.MM.YYYY HH:mm');
        },
        loadGroupData () {
            this.$axios
                .$get(`/todo-group/get-group/${this.$route.params.id}`)
                .then((result) => (this.group = result.item));
        },
        loadTodoGroups () {
            this.$axios
                .$get(`/todo-group/todo/${this.$route.params.id}/list`)
                .then((result) => {
                    this.groups = TodoGroupsService.createGroups(result.items);

                    this.createStatuses();
                });
        },
        loadUsers () {
            this.$axios
                .$get(`/todo-group/${this.$route.params.id}/users/list`)
                .then((result) => {
                    this.users = result.items;
                });
        },
        initWsListeners () {
            const listeners = {
                connection_ready: () => {
                    this.$eventBus.$emit(events.ON_NEW_NOTIFICATION, 'Установлено соединение для общего доступа');
                },
                ws_error: (msg) => {
                    if (msg.type === 'NotFoundException' || msg.type === 'ForbiddenException') {
                        this.$eventBus.$emit(events.ON_NEW_NOTIFICATION, 'Ошибка аутентификации', 'danger');
                        this.socket.close();
                    }
                },
                'todo-created': (model) => {

                    const card = TodoItemService.createCards([model])[0];

                    this.moveCardToGroupBottom(card);

                    console.log('todo-created', model);
                },
                'todo-state-changed': (model) => {

                    for (const group of this.groups) {

                        for (const todo of group.todo) {

                            if (Number(todo.id) !== Number(model.id)) {
                                continue;
                            }

                            todo = Object.assign(todo, model);

                            if (Number(todo.statusId) !== Number(group.status.id)) {

                                const index = group.todo.indexOf(todo);

                                group.todo.splice(index, 1);

                                this.moveCardToGroupTop(todo);

                            }

                            break;
                        }

                    }
                },
                'todo-deleted': (model) => {
                    for (const group of this.groups) {

                        for (const todo of group.todo) {

                            if (Number(todo.id) !== Number(model.id)) {
                                continue;
                            }

                            const index = group.todo.indexOf(todo);

                            group.todo.splice(index, 1);

                            break;
                        }

                    }
                },
            };

            for (const prop in listeners) {

                if (this.socket.hasListeners('error') === false) {
                    this.socket.on(prop, listeners[prop]);
                }
            }
        },
        initWsConnection () {

            if (Boolean(process.client) === false) {

                return;
            }

            if (this.$socketClient.hasConnection('todo_access_group') === false) {

                const socket = this.$socketClient
                    .create({
                        transports: ['websocket'],
                        path: '/todo',
                        query: {
                            token: this.$store.getters['todo/getToken'],
                        },
                    }, '/todo');

                this.$socketClient.addConnection('todo_access_group', socket);
            }

            this.socket = this.$socketClient.getConnection('todo_access_group');

            this.initWsListeners();

            if (this.socket.hasListeners('error') === false) {

                this.socket.io.on('error', () => {
                    this.$eventBus.$emit(events.ON_NEW_NOTIFICATION, 'Ошибка соединения общего доступа', 'danger');
                });

            }

            this.currentGroupId = this.$route.params.id;

            this.socket.emit('join_access_group', {group: this.currentGroupId});

        },
        moveCardToGroupTop: function (card) {
            for (const group of this.groups) {
                if (Number(card.statusId) !== Number(group.status.id)) {
                    continue;
                }

                group.todo = [card].concat(group.todo);

                break;
            }
        },
        moveCardToGroupBottom: function (card) {
            for (const group of this.groups) {
                if (Number(card.statusId) !== Number(group.status.id)) {
                    continue;
                }

                group.todo.push(card);

                break;
            }
        },
        clearIntervals: function () {

            this.intervals.forEach((interval) => {

                clearInterval(interval);
            });
        },
        createStatuses () {
            const pairs = [];

            for (const group of this.groups) {
                const status = group.status;

                pairs.push({
                    id: status.id,
                    name: status.name,
                });
            }

            this.statuses = pairs;
        },
        addCard () {
            this.$eventBus.showCardManageModal(
                TodoItem.getInstance(),
                'create'
            );
        },
        moveToGroup (cardId, statusId) {
            this.$axios
                .$put(
                    `todo-group/todo/${this.$route.params.id}/set-status/${cardId}`,
                    { statusId }
                )
                .then(() => {
                    this.loadTodoGroups();
                });
        },
        changeStatus (card, event) {
            this.moveToGroup(card.id, event.target.value);
        },
        onMoveCard (event, card) {
            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('todo_card_id', card.id);
        },
        moveCard (event, group) {
            const cardId = event.dataTransfer.getData('todo_card_id');

            this.moveToGroup(cardId, group.status.id);
        },
        deleteCard (id) {
            this.$axios
                .$delete(
                    `/todo-group/todo/${this.$route.params.id}/delete/${id}`
                )
                .then(() => {
                    this.loadTodoGroups();
                });
        },
        deleteGroup () {
            this.$axios
                .$delete(`/todo-group/delete/${this.$route.params.id}`)
                .then(() => {
                    this.$store.dispatch(
                        'todo/updateTodoGroups',
                        this.$userStorage
                    );
                    this.$router.push('/todo-list');
                });
        },
        editCard (card) {
            this.$eventBus.showCardManageModal(card, 'update');
        },
        fillForm (state) {
            state.formData.name = this.group.name;
            state.formData.description = this.group.description;
        },
    },
};
</script>
