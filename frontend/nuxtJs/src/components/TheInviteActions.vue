<template>
    <div class="navbar-item">
        <div class="buttons">
            <NuxtLink
                v-if="isLogged && $route.path === '/'"
                class="button"
                :to="ROUTE_TODO_LIST"
                exact-active-class="is-primary"
            >
                Список задач
            </NuxtLink>

            <a
                v-if="isLogged === true"
                class="button is-danger"
                @click="logout"
            >
                Выйти
            </a>

            <NuxtLink
                v-if="isLogged === false"
                class="button"
                :to="ROUTE_HOME"
                exact-active-class="is-primary"
            >
                Регистрация
            </NuxtLink>

            <NuxtLink
                v-if="isLogged === false"
                class="button"
                :to="ROUTE_LOGIN"
                exact-active-class="is-primary"
            >
                Вход
            </NuxtLink>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ROUTE_TODO_LIST, ROUTE_HOME, ROUTE_LOGIN } from '@/constants/routes';

export default {
    computed: {
        ...mapGetters('todo', ['isLogged']),
        ROUTE_TODO_LIST: () => ROUTE_TODO_LIST,
        ROUTE_LOGIN: () => ROUTE_LOGIN,
        ROUTE_HOME: () => ROUTE_HOME,
    },
    methods: {
        logout () {
            this.$userStorage.flushData();
            this.$userStorage.flushClientCookie();

            this.$store.dispatch(
                'todo/setUserData',
                this.$userStorage.getUserData()
            );

            window.location.href = '/login';
        },
    },
};
</script>
