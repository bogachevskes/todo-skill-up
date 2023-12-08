<template>
    <div class="navbar-item">
        <div class="buttons">
            <a
                v-if="isLogged === true"
                class="button is-danger"
                @click="logout"
            >
                Выйти
            </a>

            <button v-if="isLogged === false"
                class="button"
                :class="{'is-warning': onRegistration === false, 'is-primary': onRegistration === true}"
                @click="setOnRegistration(true)"
            >
                Регистрация
            </button>

            <button v-if="isLogged === false"
                class="button"
                :class="{'is-success': onRegistration === true, 'is-primary': onRegistration === false}"
                @click="setOnRegistration(false)"
            >
                Вход
            </button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters('user', ['isLogged']),
        ...mapGetters('invite', ['onRegistration']),
    },
    methods: {
        setOnRegistration (condition) {
            this.$store.dispatch(
                'invite/setOnRegistration',
                condition
            );
        },
        logout () {
            this.$userStorage.flushData();
            this.$userStorage.flushClientCookie();

            this.$store.dispatch(
                'user/setUserData',
                this.$userStorage.getUserData()
            );

            window.location.href = '/';
        },
    },
};
</script>
