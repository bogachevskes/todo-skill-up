<template>
    <aside
        class="column is-2 is-narrow-mobile is-fullheight section is-hidden-mobile"
    >
        <p class="menu-label is-hidden-touch">Возможности</p>
        <ul class="menu-list">
            <li>
                <NuxtLink
                    class="has-text-left"
                    :to="ROUTE_TODO_LIST"
                    active-class="is-active"
                    exact
                >
                    Мои задачи
                </NuxtLink>
            </li>
            <li v-if="canManageUsers" class="mt-1">
                <NuxtLink :to="ROUTE_USERS" active-class="is-active" exact>
                    Пользователи
                </NuxtLink>
            </li>
            <li>
                <button
                    class="button is-success mt-1 has-text-left"
                    @click="modals.addTodoAccessGroup.isActive = true"
                >
                    Создать доску
                </button>
                <ul>
                    <li
                        v-for="(data, index) in todoAccessGroups"
                        :key="index"
                        class="mt-1"
                    >
                        <NuxtLink
                            class=""
                            :to="`${ROUTE_USER_SHOW_TODO_ACCESS_GROUP}/${parseInt(
                                data.id
                            )}`"
                            active-class="is-active"
                            exact
                        >
                            <span class="ml-2">{{ data.name }}</span>
                        </NuxtLink>
                    </li>
                </ul>
            </li>
        </ul>
        <AccessGroupsActionsModal :modal="modals.addTodoAccessGroup" />
    </aside>
</template>

<script>

import { mapGetters, mapState } from 'vuex';
import AccessGroupsActionsModal from './left-side-bar/AccessGroupsActionsModal';
import {
    ROUTE_TODO_LIST,
    ROUTE_USERS,
    ROUTE_USER_SHOW_TODO_ACCESS_GROUP,
} from '@/constants/routes';


export default {
    data () {
        return {
            modals: {
                addTodoAccessGroup: {
                    isActive: false,
                },
            },
        };
    },
    computed: {
        ...mapState('todo', ['todoAccessGroups']),
        ...mapGetters('todo', [
            'isLogged',
            'canManageUsers',
            'canManageUsersTodo',
        ]),
        ROUTE_TODO_LIST: () => ROUTE_TODO_LIST,
        ROUTE_USERS: () => ROUTE_USERS,
        ROUTE_USER_SHOW_TODO_ACCESS_GROUP: () =>
            ROUTE_USER_SHOW_TODO_ACCESS_GROUP,
    },
    components: {
        AccessGroupsActionsModal,
    },
};
</script>

<style></style>
