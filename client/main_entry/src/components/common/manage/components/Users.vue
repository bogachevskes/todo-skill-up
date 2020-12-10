<template>
    <div>
        <data-table-item
            :data="data"
            :fields="fields"
        >
            <template slot="status" slot-scope="prop">
                <vb-switch-item
                    type="success"
                    size="large"
                    v-model="prop.data.status"
                    :value="1"
                    @change="onChange($event, prop.data.id)"
                >
                </vb-switch-item>
                <span class='ml-2'>{{ printYesNo(prop.data.status) }}</span>
            </template>

            <template slot="actions" slot-scope="prop">
                <router-link
                    v-if="canManageUsersTodoes"
                    class="button is-info is-small"
                    :to="{
                        name: todoesRoute,
                        params: {
                            id: parseInt(prop.data.id)
                        }
                    }"
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

    library.add(faEye, faEdit, faTrash);

    export default {
        data: function() {
            return {
                data: [
                    {
                        id: 5,
                        name: 'admin',
                        email: 'admin@admin.com',
                        status: 1,
                    },
                ],
                fields: [
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
        },
        computed: {
            ...mapGetters({
                canManageUsersTodoes: 'canManageUsersTodoes',
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
    }

</script>

<style>

</style>