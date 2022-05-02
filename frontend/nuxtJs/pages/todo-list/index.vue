<template>
    <div class="column is-10">
        <div class="section has-background-info" style="padding: 20px">
            <ManageCard />
            <div class="columns">
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
    </div>
</template>

<script>
import { mapState } from 'vuex';
import ManageCard from '@/components/todo-list/ManageCard';
import Group from '@/components/todo-list/Group';


import TodoItem from '@/plugins/models/TodoItem';

export default {
    layout: 'desk',
    data () {
        return {
            groupStatuses: null,
        };
    },
    computed: {
        ...mapState('todo', ['groups']),
        statuses () {
            if (Array.isArray(this.groupStatuses) === false) {
                this.groupStatuses = this.$userStorage.getGroupsPairs();
            }

            return this.groupStatuses;
        },
    },
    beforeCreate () {
        this.$store.dispatch('todo/updateGroupsList', this.$userStorage);
    },
    methods: {
        addCard () {
            this.$eventBus.showCardManageModal(
                TodoItem.getInstance(),
                'create'
            );
        },
        moveToGroup (cardId, statusId) {
            this.$axios
                .$put(`todo/set-status/${cardId}`, { statusId })
                .then(() => {
                    this.$store.dispatch(
                        'todo/updateGroupsList',
                        this.$userStorage
                    );
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
            this.$axios.$delete(`todo/delete/${id}`).then(() => {
                this.$store.dispatch(
                    'todo/updateGroupsList',
                    this.$userStorage
                );
            });
        },
        editCard (card) {
            this.$eventBus.showCardManageModal(card, 'update');
        },
    },
    components: {
        ManageCard,
        Group,
    },
};
</script>
