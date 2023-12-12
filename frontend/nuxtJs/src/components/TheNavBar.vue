<template>
    <div>
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <span class="navbar-brand">
                <a class="navbar-item nav-left" href="/">
                    <img src="~/assets/bulma-logo.svg" width="40" height="28" />
                    TODO LIST
                </a>
            </span>
            <div class="navbar-end" v-if="showInviteAction === true">
                <div v-if="getPermissions.length > 0" class="navbar-item">
                    <div class="dropdown is-right" :class="{'is-active': actionsActive}" @click="actionsActive = actionsActive === false">
                        <div class="dropdown-trigger">
                            <button class="button is-warning" aria-haspopup="true" aria-controls="dropdown-menu">
                                <span>Дополнительно</span>
                            </button>
                        </div>
                        <div class="dropdown-menu" id="dropdown-menu" role="menu">
                            <div class="dropdown-content">
                                <NuxtLink v-if="hasPermission('/admin/users')" :to="'/admin/users'" class="dropdown-item" active-class="is-active" exact>
                                    Администрирование пользователей
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
                <TheInviteActions />
            </div>
        </nav>
    </div>
</template>

<script>

import { mapGetters } from 'vuex';
import TheInviteActions from './TheInviteActions';

export default {
    name: 'TheNavBar',
    props: {
        showInviteAction: {
            type: Boolean,
            default: true,
        },
    },
    components: {
        TheInviteActions,
    },
    data() {
        return {
            actionsActive: false,
        };
    },
    computed: {
        ...mapGetters('user', ['getPermissions']),
    },
    methods: {
        hasPermission(permission) {
            return this.getPermissions.includes(permission);
        }
    },
};
</script>

<style scoped>
@media screen and (min-width: 400px) {
    .navbar-end {
        justify-content: flex-end;
        margin-left: auto;
    }
}

@media screen and (min-width: 400px) {
    .navbar,
    .navbar-menu,
    .navbar-start,
    .navbar-end {
        align-items: stretch;
        display: flex;
    }
}
</style>
