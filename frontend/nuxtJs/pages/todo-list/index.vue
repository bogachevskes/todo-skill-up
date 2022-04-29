<template>
        <div class="column is-10">
            <div class="section has-background-info" style="padding: 20px;">
                <ManageCard />
                <div class="columns">
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
        </div>
</template>

<script>
    import ManageCard from '@/components/todo-list/ManageCard';
    import Group from '@/components/todo-list/Group';

    import { mapState } from 'vuex';

    import TodoItem from '@/plugins/models/TodoItem';

    export default {
        layout: 'desk',
        data: function () {
            return {
                groupStatuses: null,
            };
        },
        computed: {
            ...mapState('todoes', [
                'groups',
            ]),
            statuses: function () {
                if (Array.isArray(this.groupStatuses) === false) {
                    this.groupStatuses = this.$userStorage.getGroupsPairs();
                }

                return this.groupStatuses;
            },
        },
        methods: {
            addCard: function () {
                this.$eventBus.showCardManageModal(
                        TodoItem.getInstance(),
                        'create'
                    );
            },
            moveToGroup: function (cardId, statusId) {
                this.$axios.$put(`todo/set-status/${cardId}`, { statusId })
                    .then(() => {
                        this.$store.dispatch('todoes/updateGroupsList', this.$userStorage);
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
                this.$axios.$delete(`todo/delete/${id}`)
                    .then(() => {
                        this.$store.dispatch('todoes/updateGroupsList', this.$userStorage);
                    });
            },
            editCard: function (card) {
                this.$eventBus.showCardManageModal(
                        card,
                        'update'
                    );
            },
        },
        components: {
            ManageCard,
            Group,
        },
        beforeCreate: function () {
            this.$store.dispatch('todoes/updateGroupsList', this.$userStorage);
        },
    }
</script>