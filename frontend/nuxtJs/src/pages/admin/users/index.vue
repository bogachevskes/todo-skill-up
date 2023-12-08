<template>
    <div class="column">
        <div class="section has-background-info" style="padding: 20px">
            <div>
                <NuxtLink
                    class="button is-success mb-2"
                    :to="'/admin/users/create'"
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
                            class="button is-warning is-small ml-2"
                            :to="`/admin/users/update/${Number(props.row.id)}`"
                        >
                            <b-icon icon="pencil" />
                        </NuxtLink>
                        <button
                            class="button is-danger is-small ml-2"
                            :disabled="isCurrentUser(props.row.id)"
                            @click="deleteUser(props.row.id)"
                        >
                            <b-icon icon="delete" />
                        </button>
                    </template>
                </b-table-column>
            </b-table>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import DateHelper from '@/plugins/helpers/DateHelper';

export default {
    name: 'ManageUsers',
    data () {
        return {
            users: [],
        };
    },
    methods: {
        setUserActiveState(val, id) {
            const active = Number(val);

            this.$axios
                .$patch(`/admin/users/${id}`, {
                    formData: {
                        status: active,
                    }
                })
                .then((x) => this.loadUsersList());
        },
        deleteUser(userId) {
            this.$axios
                .$delete(`/admin/users/${userId}`)
                .then((x) => this.loadUsersList());
        },
        loadUsersList() {
            this.$axios
                .$get('/admin/users')
                .then((users) => {
                    this.users = users;
                });
        },
        isCurrentUser(userId) {
            return Number(this.getUserId) === Number(userId);
        },
    },
    computed: {
        ...mapGetters('user', ['getUserId']),
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
