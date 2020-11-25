<template>
      <section class="hero is-info is-fullheight" style="min-height:600px;">
        <div class="hero-body">
            <div class="container">
                <manage-card-item></manage-card-item>
                <div class="columns">
                    <div class="column is-3">
                        <aside class="menu has-background-white px-3 py-3">
                            <p class="menu-label">
                                Возможности
                            </p>
                            <ul class="menu-list">
                                <li class="is-right">
                                    <a class="is-active" @click="addCard">Добавить задачу</a>
                                </li>
                            </ul>
                        </aside>
                    </div>
                </div>
                <div class="columns">
                    <group-item
                        v-for="(group, index) in groups"
                        :key="index"
                        :group="group"
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

    import axios from '@axios/base';
    import { mapState } from 'vuex';

    import { eventBus } from '@store/eventBus';

    import TodoItem from '@models/TodoItem';

    export default {
        computed: {
            ...mapState([
                'groups',
            ]),
        },
        components: {
            'group-item': Group,
            'manage-card-item': ManageCard,
        },
        methods: {
            deleteCard: function (id) {
                axios.delete('todo/delete', { data: { id } })
                    .then(() => {
                        this.$store.dispatch('updateGroupsList', this.$userStorage);
                    });
            },
            addCard: function () {
                eventBus.showCardManageModal(
                        TodoItem.getInstance(),
                        'create'
                    );
            },
            editCard: function (card) {
                eventBus.showCardManageModal(
                        card,
                        'update'
                    );
            }
        },
        beforeCreate: function () {
            this.$store.dispatch('updateGroupsList', this.$userStorage);
        },
    }
</script>