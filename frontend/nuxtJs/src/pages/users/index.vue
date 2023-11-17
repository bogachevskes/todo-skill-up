<template>
    <div class="column">
        <div class="section has-background-info" style="padding: 20px">
            <div>
                <NuxtLink
                    v-if="canManageUsersTodo"
                    class="button is-success mb-2"
                    :to="ROUTE_USER_CREATE"
                >
                    <b-icon icon="account-plus" />
                    <span class="ml-2">Создать пользователя</span>
                </NuxtLink>
            </div>
            <b-table
                :data="users"
                :paginated="true"
                :per-page="10"
                :current-page="1"
            >
                <b-table-column field="id" label="ID" width="40">
                    <template #default="props">
                        {{ props.row.id }}
                    </template>
                </b-table-column>
                <b-table-column field="name" label="Имя">
                    <template #default="props">
                        {{ props.row.name }}
                    </template>
                </b-table-column>
                <b-table-column field="email" label="Почта">
                    <template #default="props">
                        {{ props.row.email }}
                    </template>
                </b-table-column>
                <b-table-column field="status" label="Активный" width="120">
                    <template #default="props">
                        <b-switch
                            v-model="props.row.status"
                            type="success"
                            size="large"
                            :true-value="1"
                            :false-value="0"
                            :disabled="isCurrentUser(props.row.id)"
                            @input="setUserActiveState($event, props.row.id)"
                        >
                            {{
                                Boolean(props.row.status) === true
                                    ? 'Да'
                                    : 'Нет'
                            }}
                        </b-switch>
                    </template>
                </b-table-column>
                <b-table-column field="createdAt" label="Дата создания">
                    <template #default="props">
                        {{ DateHelper.printFormatted(props.row.createdAt) }}
                    </template>
                </b-table-column>
                <b-table-column field="updatedAt" label="Дата обновления">
                    <template #default="props">
                        {{ DateHelper.printFormatted(props.row.updatedAt) }}
                    </template>
                </b-table-column>
                <b-table-column label="Действия">
                    <template #default="props">
                        <NuxtLink
                            v-if="canManageUsersTodo"
                            class="button is-info is-small"
                            :to="getManageTodoRoute(props.row)"
                        >
                            <b-icon icon="format-list-checks" />
                            <span class="ml-2">Задачи</span>
                        </NuxtLink>
                        <NuxtLink
                            class="button is-warning is-small ml-2"
                            :to="updateUserRoute(props.row)"
                        >
                            <b-icon icon="pencil" />
                            <span class="ml-2">Изменить</span>
                        </NuxtLink>
                        <button
                            class="button is-danger is-small ml-2"
                            :disabled="isCurrentUser(props.row.id)"
                            @click="deleteUser(props.row.id)"
                        >
                            <b-icon icon="delete" />
                            <span class="ml-2">Удалить</span>
                        </button>
                    </template>
                </b-table-column>
            </b-table>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import {
    ROUTE_TODO_LIST,
    ROUTE_USER_TODO_LIST,
    ROUTE_USER_CREATE,
    ROUTE_USER_UPDATE,
} from '@/constants/routes';

import DateHelper from '@/plugins/helpers/DateHelper';

export default {
    layout: 'desk',
    data () {
        return {
            users: [],
        };
    },
    methods: {
        setUserActiveState (val, id) {
            const active = Number(val);

            this.$axios
                .$put(`/admin/users/set-active-state/${id}`, { active })
                .then((x) => this.loadUsersList());
        },
        deleteUser (userId) {
            this.$axios
                .$delete(`/admin/users/delete/${userId}`)
                .then((x) => this.loadUsersList());
        },
        loadUsersList () {
            this.$axios
                .$get('/admin/users/list')
                .then((result) => {
                this.users = result.items || [];
            });
        },
        isCurrentUser (userId) {
            return this.$userStorage.getUserId() == userId;
        },
        getManageTodoRoute (data) {
            if (this.isCurrentUser(data.id)) {
                return ROUTE_TODO_LIST;
            }

            return `${ROUTE_USER_TODO_LIST}/${parseInt(data.id)}`;
        },
        updateUserRoute (data) {
            return `${ROUTE_USER_UPDATE}/${parseInt(data.id)}`;
        },
    },
    computed: {
        ...mapGetters('todo', ['canManageUsersTodo']),
        ROUTE_USER_CREATE: () => ROUTE_USER_CREATE,
        DateHelper: () => DateHelper,
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.loadUsersList();
        });
    },
};
</script>

<style>
.switch-disabled {
    opacity: 0.5;
}
</style>
