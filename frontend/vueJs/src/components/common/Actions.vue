<template>
    <aside class="column is-2 is-narrow-mobile is-fullheight section is-hidden-mobile">
        <p class="menu-label is-hidden-touch">Возможности</p>
        <ul class="menu-list">
            <li>
                <router-link
                    :to="getTodoListRoute"
                    tag="a"
                    active-class="is-active"
                    exact
                >
                    Мои задачи
                </router-link>
            </li>
            <li v-if="canManageUsers" class="mt-1">
                <router-link
                    to="/manage/users"
                    tag="a"
                    active-class="is-active"
                    exact
                >
                    Пользователи
                </router-link>
            </li>
            <li>
                <button
                    class="button is-success mt-1"
                    @click="modals.addTodoAccessGroup.isActive = true"
                >
                    Создать доску
                </button>
                <ul>
                    <li v-for="(data, index) in todoAccessGroups" :key="index" class="mt-1">
                        <router-link
                            class=""
                            active-class="is-active"
                            :to="showTodoAccessGroupRoute(data)"
                        >
                            <span class="ml-2">{{ data.name }}</span>
                        </router-link>
                    </li>
                </ul>
            </li>
        </ul>
        <access-groups-modal-item
            :modal="modals.addTodoAccessGroup"
        ></access-groups-modal-item>
    </aside>
</template>

<script>
    import { mapGetters, mapState } from 'vuex';
    import { ROUTE_SHOW_TODO_ACCESS_GROUP } from '@router/routes';
    import ActionsModal from './access-groups/ActionsModal';

    export default {
        data: function () {
            return {
                modals: {
                    addTodoAccessGroup: {
                        isActive: false,
                    }
                },
            };
        },
        computed: {
            ...mapState([
                'todoAccessGroups',
            ]),
            ...mapGetters({
                canManageUsers: 'canManageUsers',
                canManageUsersTodoes: 'canManageUsersTodoes',
                getTodoListRoute: 'getTodoListRoute',
            }),
        },
        methods: {
            showTodoAccessGroupRoute: function (data) {
                return {
                    name: ROUTE_SHOW_TODO_ACCESS_GROUP,
                    params: {
                        id: parseInt(data.id)
                    }
                }
            },
        },
        components: {
            'access-groups-modal-item': ActionsModal,
        },
    }
</script>

<style>

</style>