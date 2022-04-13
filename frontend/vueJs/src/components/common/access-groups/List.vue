<template>
    <section class="main-content columns is-fullheight is-info">
        <actions-item></actions-item>
        <div class="container column is-10">
            <div class="section has-background-info" style="padding: 20px;">
                <div class="columns mt-1">

                    <div class="column is-6">
                        <div class="box">
                            <div style="display: inline-block;">
                                {{ group.description }}
                                <br>
                                Создал
                                <span class="tag is-primary is-medium">
                                    {{ group.user_name }} ({{ getDate(group.createdAt) }})
                                </span>
                            </div>
                            <div v-if="Number(group.user_id) === $userStorage.getUserId()"
                                class="is-pulled-right" style="display: inline-block; vertical-align:top; margin-top: 8px;"
                            >
                                <button
                                    class="button is-warning"
                                    @click="modals.updateTodoAccessGroup.isActive = true"
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
                        <manage-users-item
                            :users="users"
                            :loadUsers="loadUsers"
                        ></manage-users-item>
                    </div>

                </div>
                <manage-card-item
                    :loadTodoGroups="loadTodoGroups"
                ></manage-card-item>
                <div class="columns mt-1">
                    <group-item
                        v-for="(group, index) in groups"
                        :key="index"
                        :group="group"
                        :statuses="statuses"
                        :addCard="addCard"
                        :changeStatus="changeStatus"
                        :onMoveCard="onMoveCard"
                        :moveCard="moveCard"
                        :deleteCard="deleteCard"
                        :editCard="editCard"
                    ></group-item>
                </div>
            </div>
        </div>
        <access-groups-modal-item
            :mode="'update'"
            :groupId="group.id"
            :modal="modals.updateTodoAccessGroup"
            :beforeAction="fillForm"
            :afterAction="loadGroupData"
        ></access-groups-modal-item>
    </section>
</template>

<script>
    import Group from './list/Group';
    import ManageCard from './list/ManageCard';
    import ManageUsers from './list/ManageUsers';
    import ActionsModal from './ActionsModal';
    import Actions from '@common-components/Actions';

    import axios from '@axios/base';

    import TodoItem from '@models/TodoItem';

    import { eventBus } from '@store/eventBus';

    import TodoGroupsService from '@services/TodoGroupsService';
    import DateHelper from '@helpers/DateHelper';

    export default {
        data: function () {
            return {
                group: [],
                groups: [],
                statuses: [],
                users: [],
                modals: {
                    updateTodoAccessGroup: {
                        isActive: false,
                    },
                },
            };
        },
        computed: {

        },
        components: {
            'group-item': Group,
            'manage-card-item': ManageCard,
            'actions-item': Actions,
            'manage-users-item': ManageUsers,
            'access-groups-modal-item': ActionsModal,
        },
        methods: {
            getDate: function (date) {
                
                return DateHelper.format(date, "DD.MM.YYYY HH:mm");
            },
            loadGroupData: function () {
                axios.get(`/todo-access-group/get-group/${this.$route.params.id}`)
                    .then(result => this.group = result.data.item);
            },
            loadTodoGroups: function () {
                axios.get(`/todo-access-group/todo/${this.$route.params.id}/list`)
                    .then((result) => {
                        this.groups = TodoGroupsService.createGroups(result.data.items);

                        this.createStatuses();
                    });
            },
            loadUsers: function () {
                axios.get(`/todo-access-user-group/${this.$route.params.id}/list`)
                    .then((result) => {
                        this.users = result.data.items;
                    });
            },
            createStatuses: function () {
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
            addCard: function () {
                eventBus.showCardManageModal(
                        TodoItem.getInstance(),
                        'create'
                    );
            },
            moveToGroup: function (cardId, statusId) {
                axios.put(`todo-access-group/todo/${this.$route.params.id}/set-status/${cardId}`, { statusId })
                    .then(() => {
                        this.loadTodoGroups();
                    });
            },
            changeStatus: function (card, event) {
                this.moveToGroup(card.id, event.target.value);
            },
            onMoveCard: function (event, card) {
                event.dataTransfer.dropEffect = 'move';
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('todo_card_id', card.id);
            },
            moveCard: function (event, group) {
                const cardId = event.dataTransfer.getData('todo_card_id');

                this.moveToGroup(cardId, group.status.id);
            },
            deleteCard: function (id) {
                axios.delete(`/todo-access-group/todo/${this.$route.params.id}/delete/${id}`)
                    .then(() => {
                        this.loadTodoGroups();
                    });
            },
            deleteGroup: function () {
                axios.delete(`/todo-access-group/delete/${this.$route.params.id}`)
                    .then(() => {
                        this.$store.dispatch('updateTodoAccessGroups', this.$userStorage);
                        this.$router.push('/todo-list');
                    });
            },
            editCard: function (card) {
                eventBus.showCardManageModal(
                        card,
                        'update'
                    );
            },
            fillForm: function (state) {

                state.formData.name = this.group.name;
                state.formData.description = this.group.description;

            },
        },
        mounted: function () {
            this.loadGroupData();
            this.loadTodoGroups();
            this.loadUsers();
        },
        beforeRouteUpdate: function (_to, _from, next) {
            this.loadGroupData();
            this.loadTodoGroups();
            this.loadUsers();

            next();
        },
    }
</script>