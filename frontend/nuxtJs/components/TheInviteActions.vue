<template>
    <div class="navbar-item">
        <div class="buttons">
            <NuxtLink
                class="button"
                v-if="isLogged && $route.path === '/'"
                :to="ROUTE_TODO_LIST"
                exact-active-class="is-primary"
            >
                Список задач
            </NuxtLink>

            <a
                class="button is-danger"
                v-if="isLogged === true"
                @click="logout"
            >
                Выйти
            </a>

            <NuxtLink
                class="button"
                v-if="isLogged === false"
                :to="ROUTE_HOME"
                exact-active-class="is-primary"
            >
                Регистрация
            </NuxtLink>

            <NuxtLink
                class="button"
                v-if="isLogged === false"
                :to="ROUTE_LOGIN"
                exact-active-class="is-primary"
            >
                Вход
            </NuxtLink>

        </div>
    </div>
</template>

<script>
    
    import { mapGetters } from "vuex";
    import { ROUTE_TODO_LIST, ROUTE_HOME, ROUTE_LOGIN } from '@/constants/routes';
    
    export default {
        computed: {
            ...mapGetters('todo', [
                'isLogged',
            ]),
            ROUTE_TODO_LIST: () => ROUTE_TODO_LIST,
            ROUTE_LOGIN: () => ROUTE_LOGIN,
            ROUTE_HOME: () => ROUTE_HOME,
        },
        methods: {
            logout: function () {
                this.$userStorage.flushData();
                this.$userStorage.flushClientCookie();

                this.$store.dispatch('todo/setUserData', this.$userStorage.getUserData());

                window.location.href = '/login';
            }
        },
    };

</script>