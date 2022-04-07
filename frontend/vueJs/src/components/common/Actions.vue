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
                    Список задач
                </router-link>
            </li>
            <li v-if="canManageUsers">
                <router-link
                    to="/manage/users"
                    tag="a"
                    active-class="is-active"
                    exact
                >
                    Управление пользователями
                </router-link>
            </li>
            <li>
                <a href="#">
                    Общий доступ
                </a>
                <ul>
                    <li class="mb-2">
                        <button
                            class="button is-success"
                            @click="() => {}"
                        >
                            Создать доску
                        </button>
                    </li>
                    <li v-for="(data, index) in todoAccessGroups" :key="index">
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
    </aside>
</template>

<script>
    import { mapGetters, mapState } from 'vuex';
    import { ROUTE_SHOW_TODO_ACCESS_GROUP } from '@router/routes';

    export default {
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
    }
</script>

<style>

</style>