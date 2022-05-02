<template>
        <div class="column is-10">
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
                                class="is-pulled-right"
                                style="display: inline-block; vertical-align:top; margin-top: 8px;"
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
                        <ManageUsers :users="users" :loadUsers="loadUsers" />
                    </div>
                </div>
                <ManageCard :loadTodoGroups="loadTodoGroups" />
                <div class="columns mt-1">
                    <Group
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
                    />
                </div>
            </div>
            <AccessGroupsActionsModal
                :mode="'update'"
                :groupId="group.id"
                :modal="modals.updateTodoAccessGroup"
                :beforeAction="fillForm"
                :afterAction="loadGroupData"
            />
        </div>
</template>

<script>
    import Group from '@/components/todo-access-group/Group';
    import ManageCard from '@/components/todo-access-group/ManageCard';
    import ManageUsers from '@/components/todo-access-group/ManageUsers';
    import AccessGroupsActionsModal from '@/components/left-side-bar/AccessGroupsActionsModal';

    import TodoItem from '@/plugins/models/TodoItem';
    import TodoGroupsService from '@/plugins/services/TodoGroupsService';
    import DateHelper from '@/plugins/helpers/DateHelper';

    export default {
        layout: 'desk',
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
            Group,
            ManageCard,
            ManageUsers,
            AccessGroupsActionsModal,
        },
        methods: {
            getDate: function (date) {
                
                return DateHelper.format(date, "DD.MM.YYYY HH:mm");
            },
            loadGroupData: function () {
                this.$axios.$get(`/todo-access-group/get-group/${this.$route.params.id}`)
                    .then(result => this.group = result.item);
            },
            loadTodoGroups: function () {
                this.$axios.$get(`/todo-access-group/todo/${this.$route.params.id}/list`)
                    .then((result) => {
                        this.groups = TodoGroupsService.createGroups(result.items);

                        this.createStatuses();
                    });
            },
            loadUsers: function () {
                this.$axios.$get(`/todo-access-user-group/${this.$route.params.id}/list`)
                    .then((result) => {
                        this.users = result.items;
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
                this.$eventBus.showCardManageModal(
                        TodoItem.getInstance(),
                        'create'
                    );
            },
            moveToGroup: function (cardId, statusId) {
                this.$axios.$put(`todo-access-group/todo/${this.$route.params.id}/set-status/${cardId}`, { statusId })
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
                this.$axios.$delete(`/todo-access-group/todo/${this.$route.params.id}/delete/${id}`)
                    .then(() => {
                        this.loadTodoGroups();
                    });
            },
            deleteGroup: function () {
                this.$axios.$delete(`/todo-access-group/delete/${this.$route.params.id}`)
                    .then(() => {
                        this.$store.dispatch('todo/updateTodoAccessGroups', this.$userStorage);
                        this.$router.push('/todo-list');
                    });
            },
            editCard: function (card) {
                this.$eventBus.showCardManageModal(
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