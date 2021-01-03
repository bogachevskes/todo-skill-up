<template>
    <div>
        <data-table-item
            :data="users"
            :fields="fields"
        >
            <template slot="status" slot-scope="prop">
                <vb-switch-item
                    :class="{'switch-disabled': isCurrentUser(prop.data.id)}"
                    type="success"
                    size="large"
                    v-model="prop.data.status"
                    :value="1"
                    :disabled="isCurrentUser(prop.data.id)"
                    @change="onChange($event, prop.data.id)"
                >
                </vb-switch-item>
                <span class='ml-2'>{{ printYesNo(prop.data.status) }}</span>
            </template>

            <template slot="actions" slot-scope="prop">
                <router-link
                    v-if="canManageUsersTodoes"
                    class="button is-info is-small"
                    :to="getManageTodoesRoute(prop.data)"
                    tag="button"
                >
                   <font-awesome-icon icon="eye"/>
                   <span class="ml-2">Задачи</span>
                </router-link>
                <button
                    class="button is-warning is-small ml-2"
                >
                    <font-awesome-icon icon="edit"/>
                    <span class="ml-2">Изменить</span>
                </button>
                <button
                    class="button is-danger is-small ml-2"
                    :disabled="isCurrentUser(prop.data.id)"
                >
                    <font-awesome-icon icon="trash"/>
                    <span class="ml-2">Удалить</span>
                </button>
            </template>
        </data-table-item>
    </div>
</template>

<script>
    import DataTable from '@components/DataTable';

    import { mapGetters } from 'vuex';

    import VbSwitch from 'vue-bulma-switch';

    import { ROUTE_USERS_TODOES_LIST } from '@router/routes';

    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

    import DateHelper from '@helpers/DateHelper';

    library.add(faEye, faEdit, faTrash);

    import axios from '@axios/base';

    export default {
        data: function() {
            return {
                users: [],
                fields: [
                    {
                        name: 'id',
                        label: '#',
                    },
                    {
                        name: 'name',
                        label: 'Имя',
                    },
                    {
                        name: 'email',
                        label: 'Почта',
                    },
                    {
                        name: 'status',
                        label: 'Активный',
                        slot: true,
                    },
                    {
                        name: 'createdAt',
                        label: 'Дата создания',
                        callback: data => {
                            return DateHelper.printFormatted(data.createdAt);
                        }
                    },
                    {
                        name: 'updatedAt',
                        label: 'Дата обновления',
                        callback: data => {
                            return DateHelper.printFormatted(data.updatedAt);
                        }
                    },
                    {
                        name: 'actions',
                        label: 'Действия',
                        slot: true,
                    }
                ]
            }
        },
        methods: {
            onChange: function (val, id) {
                const active = Number(val);
                
                console.log(active, id);
            },
            printYesNo: function (val) {
                return val ? 'Да' : 'Нет';
            },
            loadUsersList: function () {
                axios.get('/admin/users/list')
                    .then(result => {
                        this.users = result.data.items || [];
                    });
            },
            isCurrentUser: function (userId) {
                return this.$userStorage.getUserId() == userId;
            },
            getManageTodoesRoute: function (data) {
                if (this.isCurrentUser(data.id)) {
                    return this.getTodoListRoute;
                }

                return {
                    name: todoesRoute,
                    params: {
                        id: parseInt(prop.data.id)
                    }
                }
            }
        },
        computed: {
            ...mapGetters({
                canManageUsersTodoes: 'canManageUsersTodoes',
                getTodoListRoute: 'getTodoListRoute',
            }),
            todoesRoute: function () {
                return ROUTE_USERS_TODOES_LIST;
            },
        },
        components: {
            'data-table-item': DataTable,
            'vb-switch-item': VbSwitch,
            'font-awesome-icon': FontAwesomeIcon,
        },
        beforeRouteEnter (to, from, next) {
              next(vm => {
                vm.loadUsersList();
            })
        },
    }

</script>

<style lang="scss">

    .switch-disabled {
        opacity: .5;
    }

</style>