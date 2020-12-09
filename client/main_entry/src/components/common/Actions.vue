<template>
    <div class="columns">
        <div class="column is-3">
            <aside class="menu has-background-white px-3 py-3">
                <p class="menu-label">
                    Возможности
                </p>
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
                    <li v-if="canManageUsersTodoes">
                        <router-link
                            to="/manage/todoes-list"
                            tag="a"
                            active-class="is-active"
                            exact
                        >
                            Просмотр задач пользователей
                        </router-link>
                    </li>
                </ul>
            </aside>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        computed: {
            ...mapGetters({
                canManageUsers: 'canManageUsers',
                canManageUsersTodoes: 'canManageUsersTodoes',
                getTodoListRoute: 'getTodoListRoute',
            }),
        },
        methods: {

        },
    }
</script>

<style>

</style>