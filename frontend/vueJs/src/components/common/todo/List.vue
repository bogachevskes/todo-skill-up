<template>
    <section class="hero is-info is-fullheight" style="min-height:600px;">
        <div class="hero-body">
            <div class="container">
                <manage-card-item></manage-card-item>
                <actions-item></actions-item>
                <div class="columns">
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
    import Actions from '@common-components/Actions';

    import axios from '@axios/base';
    import { mapState} from 'vuex';

    import TodoItem from '@models/TodoItem';

    import { eventBus } from '@store/eventBus';

    export default {
        data: function () {
            return {
                groupStatuses: null,
            };
        },
        computed: {
            ...mapState([
                'groups',
            ]),
            statuses: function () {
                if (! Array.isArray(this.groupStatuses)) {
                    this.groupStatuses = this.$userStorage.getGroupsPairs();
                }

                return this.groupStatuses;
            },
        },
        components: {
            'group-item': Group,
            'manage-card-item': ManageCard,
            'actions-item': Actions,
        },
        methods: {
            addCard: function () {
                eventBus.showCardManageModal(
                        TodoItem.getInstance(),
                        'create'
                    );
            },
            moveToGroup: function (cardId, statusId) {
                axios.put(`todo/set-status/${cardId}`, { statusId })
                    .then(() => {
                        this.$store.dispatch('updateGroupsList', this.$userStorage);
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
                axios.delete(`todo/delete/${id}`)
                    .then(() => {
                        this.$store.dispatch('updateGroupsList', this.$userStorage);
                    });
            },
            editCard: function (card) {
                eventBus.showCardManageModal(
                        card,
                        'update'
                    );
            },
        },
        beforeCreate: function () {
            this.$store.dispatch('updateGroupsList', this.$userStorage);
        },
    }
</script>