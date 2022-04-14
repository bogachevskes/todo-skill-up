<template>
    <div class="navbar-item">
        <div class="buttons">
            <router-link
                v-if="isLogged && $route.path === '/'"
                class="button"
                :to="getTodoListRoute"
                tag="a"
                active-class="is-primary"
            >
                Список задач
            </router-link>
            <a class="button is-danger" v-if="isLogged" @click="logout">Выйти</a>
            <router-link
                v-if="notLogged"
                class="button"
                :to="getHomeRoute"
                tag="a"
                active-class="is-primary"
                exact
            >
                Регистрация
            </router-link>

            <router-link
                v-if="notLogged"
                class="button"
                :to="getLoginRoute"
                tag="a"
                active-class="is-primary"
                exact
            >
                Вход
            </router-link>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    
    export default {
        data: function () {
            return {

            };
        },
        computed: {
            ...mapGetters({
                getHomeRoute: 'getHomeRoute',
                getLoginRoute: 'getLoginRoute',
                getTodoListRoute: 'getTodoListRoute',
            }),
            isLogged: function () {
                return this.$store.getters.isLogged;
            },
            notLogged: function () {
                return ! this.isLogged;
            },
        },
        methods: {
            logout: function () {
                this.$userStorage.flushData();

                this.$store.dispatch('setUserData', this.$userStorage.getUserData());

                window.location.href = '/login';
            }
        },
    }
</script>