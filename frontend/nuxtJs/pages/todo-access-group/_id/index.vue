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
                                    modals.updateTodoAccessGroup.isActive = true
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
        <AccessGroupsActionsModal
            :mode="'update'"
            :group-id="group.id"
            :modal="modals.updateTodoAccessGroup"
            :before-action="fillForm"
            :after-action="loadGroupData"
        />
    </div>
</template>

<script>

import events from '@/constants/events';

import Group from '@/components/todo-access-group/Group';
import ManageCard from '@/components/todo-access-group/ManageCard';
import ManageUsers from '@/components/todo-access-group/ManageUsers';
import AccessGroupsActionsModal from '@/components/left-side-bar/AccessGroupsActionsModal';

import TodoItem from '@/plugins/models/TodoItem';
import TodoGroupsService from '@/plugins/services/TodoGroupsService';
import DateHelper from '@/plugins/helpers/DateHelper';

export default {
    components: {
        Group,
        ManageCard,
        ManageUsers,
        AccessGroupsActionsModal,
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

        next();
    },
    layout: 'desk',
    data () {
        return {
            socket: null,
            group: [],
            groups: [],
            statuses: [],
            users: [],
            intervals: [],
            modals: {
                updateTodoAccessGroup: {
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
                .$get(`/todo-access-group/get-group/${this.$route.params.id}`)
                .then((result) => (this.group = result.item));
        },
        loadTodoGroups () {
            this.$axios
                .$get(`/todo-access-group/todo/${this.$route.params.id}/list`)
                .then((result) => {
                    this.groups = TodoGroupsService.createGroups(result.items);

                    this.createStatuses();
                });
        },
        loadUsers () {
            this.$axios
                .$get(`/todo-access-user-group/${this.$route.params.id}/list`)
                .then((result) => {
                    this.users = result.items;
                });
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

            if (this.socket.hasListeners('connection_ready') === false) {

                this.socket.on('connection_ready', () => {
                    this.$eventBus.$emit(events.ON_NEW_NOTIFICATION, 'Установлено соединение для общего доступа');
                });
            }

            if (this.socket.hasListeners('error') === false) {

                this.socket.io.on('error', () => {
                    this.$eventBus.$emit(events.ON_NEW_NOTIFICATION, 'Ошибка соединения общего доступа', 'danger');
                });

            }

            if (this.socket.hasListeners('ws_error') === false) {
               
                this.socket.on('ws_error', (msg) => {
                    if (msg.type === 'NotFoundException' || msg.type === 'ForbiddenException') {
                        this.$eventBus.$emit(events.ON_NEW_NOTIFICATION, 'Ошибка аутентификации', 'danger');
                        this.socket.close();
                    }
                });

            };

            if (this.socket.hasListeners('todo-state-changed') === false) {

                this.socket.on('todo-state-changed', (msg) => console.log(msg));
            };

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
                    `todo-access-group/todo/${this.$route.params.id}/set-status/${cardId}`,
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
                    `/todo-access-group/todo/${this.$route.params.id}/delete/${id}`
                )
                .then(() => {
                    this.loadTodoGroups();
                });
        },
        deleteGroup () {
            this.$axios
                .$delete(`/todo-access-group/delete/${this.$route.params.id}`)
                .then(() => {
                    this.$store.dispatch(
                        'todo/updateTodoAccessGroups',
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
