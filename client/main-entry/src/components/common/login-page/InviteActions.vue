<template>
    <div class="navbar-item">
        <div class="buttons">
            <router-link
                class="button"
                :to="getHomeRoute"
                tag="a"
                active-class="is-primary"
                exact
            >
                Регистрация
            </router-link>

            <router-link
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
            }),
        },
    }
</script>