<template>
    <section class="main-content columns is-fullheight is-info">
        <actions-item></actions-item>
        <div class="container column is-10">
            <div class="section has-background-info" style="padding: 20px;">
                <manage-users-item
                    :users="users"
                    :loadUsers="loadUsers"
                ></manage-users-item>
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
    </section>
</template>

<script>
    import Group from './list/Group';
    import ManageCard from './list/ManageCard';
    import ManageUsers from './list/ManageUsers';
    import Actions from '@common-components/Actions';

    import axios from '@axios/base';

    import TodoItem from '@models/TodoItem';

    import { eventBus } from '@store/eventBus';

    import TodoGroupsService from '@services/TodoGroupsService';

    export default {
        data: function () {
            return {
                groups: [],
                statuses: [],
                users: [],
            };
        },
        computed: {

        },
        components: {
            'group-item': Group,
            'manage-card-item': ManageCard,
            'actions-item': Actions,
            'manage-users-item': ManageUsers,
        },
        methods: {
            loadTodoGroups: function () {
                axios.get(`/todo-access-group/todo/${this.$route.params.id}/list`)
                    .then((result) => {
                        this.groups = TodoGroupsService.createGroups(result.data.items);

                        this.createStatuses();
                    });
            },
            loadUsers: function () {
                axios.get(`/todo-access-user-group/list/${this.$route.params.id}`)
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
            editCard: function (card) {
                eventBus.showCardManageModal(
                        card,
                        'update'
                    );
            },
        },
        beforeRouteEnter (_to, _from, next) {
            next(vm => {
                vm.loadTodoGroups();
                vm.loadUsers();
            })
        },
    }
</script>