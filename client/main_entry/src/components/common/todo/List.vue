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
            changeStatus: function (card, event) {
                axios.put(`todo/set-status/${card.id}`, { statusId: event.target.value })
                    .then(result => {
                        this.$store.dispatch('updateGroupsList', this.$userStorage);
                    });
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