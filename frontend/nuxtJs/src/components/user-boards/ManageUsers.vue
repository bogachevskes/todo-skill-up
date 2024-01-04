<template>
    <div>
        <div class="box mb-0">
            <div class="card">
                <div class="card-header">
                    <p class="card-header-title">Участники</p>
                </div>
                <div class="card-content" style="padding: 10px">
                    <div class="content">
                        <button
                            v-if="userHasBoardPermission('manage-board-users')"
                            class="button is-success is-small mt-1"
                            @click="activateModal(modal.addUsers)"
                        >
                            Добавить
                        </button>
                        <button
                            v-if="userHasBoardPermission('manage-board-users') && Number(user.id) !== Number(getUserId)"
                            v-for="(user, index) in users"
                            :key="index"
                            class="button is-small is-warning mr-1 mt-1"
                            @click="handleUserEdit(user)"
                            :disabled="Number(user.id) === Number(getUserId)"
                        >
                            {{ user.email }}
                        </button>
                        <span
                            v-if="userHasBoardPermission('manage-board-users') === false && Number(user.id) !== Number(getUserId)"
                            class="tag is-info"
                            v-for="(user, index) in users"
                            :key="index"
                        >
                            {{ user.email }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal" :class="{ 'is-active': modal.addUsers.isActive }">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Добавить участника</p>
                    <button
                        class="delete"
                        aria-label="close"
                        @click="deactivateModal(modal.addUsers)"
                    ></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">Email Пользователя</label>
                        <div class="control">
                            <input
                                v-model="searchData.email"
                                class="input"
                                placeholder="email"
                            />
                        </div>
                    </div>
                    <button
                        v-for="(user, index) in userMatches"
                        :key="index"
                        class="button is-light is-small"
                        @click="addUser(user)"
                    >
                        {{ user.email }}
                    </button>
                    <div v-if="usersToAdd.length > 0">
                        <h4 class="has-text-grey mt-2 mb-1">Пользователи к добавлению:</h4>
                        <button
                            v-for="(user, index) in usersToAdd"
                            :key="index"
                            class="button is-warning mr-1"
                            @click="remove(user)"
                        >
                            {{ user.email }}
                        </button>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button
                        v-if="formData.ids.length > 0"
                        class="button is-success"
                        :class="{ 'is-loading': modal.addUsers.isLoading }"
                        :disabled="false"
                        @click="handleUserAdding"
                    >
                        Добавить
                    </button>
                    <button
                        class="button is-danger"
                        :class="{ 'is-hidden': modal.addUsers.isLoading }"
                        @click="deactivateModal(modal.addUsers)"
                    >
                        Отменить
                    </button>
                </footer>
            </div>
        </div>
        <div v-if="modal.manageUser.isActive" class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">
                        Разрешения пользователя {{ userOnEdit.entity.name }}
                    </p>
                    <button
                        class="delete"
                        aria-label="close"
                        @click="deactivateModal(modal.manageUser)"
                    ></button>
                </header>
                <section class="modal-card-body">
                    <ul>
                        <li
                            v-for="(permission, index) in Object.keys(userOnEdit.permissions)"
                            :key="index"
                        >
                            <b-switch
                                v-model="userOnEdit.permissions[permission].active"
                                type="success"
                                size="large"
                                :true-value="1"
                                :false-value="0"
                                @input="setPermissionActiveState($event, permission)"
                            >
                            <span class="has-text-black">
                                {{ userOnEdit.permissions[permission].name }}
                            </span>
                            </b-switch>
                        </li>
                    </ul>
                </section>
                <footer class="modal-card-foot">
                    <button
                        v-if="modal.manageUser.onPreDelete === false"
                        class="button is-danger"
                        @click="modal.manageUser.onPreDelete = true"
                    >
                        <span class="icon">
                            <i class="mdi mdi-account mdi-24px"></i>
                        </span>
                        <span>
                            Удалить пользователя
                        </span>
                    </button>

                    <section v-if="modal.manageUser.onPreDelete === true">
                        <div class="has-text-black mb-3">
                            Введите <span class="tag md-text">{{ userOnEdit.entity.name }}</span>
                        </div>
                        <div class="is-flex">
                            <div class="field mr-2 is-justify-content-center">
                                <div class="control">
                                    <input
                                        class="input"
                                        placeholder="Имя пользователя"
                                        v-model="modal.manageUser.nameConfirm"
                                    />
                                </div>
                            </div>
                            <button
                                class="button is-danger is-justify-content-center"
                                @click="removeUser(userOnEdit.entity)"
                                :disabled="nameConfirmedOnDelete !== true"
                            >
                                <span class="icon">
                                    <i class="mdi mdi-delete mdi-24px"></i>
                                </span>
                                <span>
                                    Удалить
                                </span>
                            </button>
                        </div>
                    </section>
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    props: {
        users: {
            type: Array,
            default: [],
        },
        boardPermissions: {
            type: Array,
            default: [],
        },
        userHasBoardPermission: {
            type: Function,
        },
        loadUsers: {
            type: Function,
            default: null,
        },
    },
    data () {
        return {
            userOnEdit: {
                entity: null,
                permissions: [],
            },
            formData: {
                ids: [],
            },
            searchData: {
                email: null,
            },
            modal: {
                addUsers: {
                    isActive: false,
                    isLoading: false,
                },
                manageUser: {
                    isActive: false,
                    onPreDelete: false,
                    nameConfirm: null,
                },
            },
            userMatches: [],
            usersToAdd: [],
            boardPermissionsTranslations: {
                'delete-board': 'Удаление досок',
                'delete-board-statuses': 'Удаление статусов досок',
                'manage-board': 'Управление досками',
                'manage-board-statuses': 'Управление статусами досок',
                'manage-board-users': 'Управление пользователями досок',
            },
        };
    },
    computed: {
        ...mapGetters('user', ['getUserId']),
        nameConfirmedOnDelete() {
            if (this.modal.manageUser.nameConfirm === null) {

                return false;
            }

            return this.modal.manageUser.nameConfirm.trim() === this.userOnEdit.entity.name;
        },
    },
    watch: {
        'searchData.email'(value) {
            if (value.length < 5) {
                return;
            }

            this.$axios
                .$get(`/users/match/?email=${this.searchData.email}`)
                .then((res) => (this.userMatches = res.items));
        },
        'modal.manageUser.isActive'(value) {
            if (value === true) {
                return;
            }

            this.modal.manageUser.onPreDelete = false;
            this.modal.manageUser.nameConfirm = null;
        }
    },
    methods: {
        isCurrentUser(userId) {
            return Number(this.getUserId) === Number(userId);
        },
        setPermissionActiveState(val, id) {
            if (Boolean(val) === true) {
                this.$axios
                    .put(`/boards/${this.$route.params.id}/users/${this.userOnEdit.entity.id}/permissions/${id}`);

                return;
            }

            this.$axios
                .delete(`/boards/${this.$route.params.id}/users/${this.userOnEdit.entity.id}/permissions/${id}`);
        },
        activateModal(modal) {
            modal.isActive = true;
        },
        deactivateModal(modal) {
            modal.isActive = false;
        },
        handleUserEdit(user) {
            this.userOnEdit.entity = user;

            for (const permission of this.boardPermissions) {
                this.userOnEdit.permissions[permission] = {
                    name: this.boardPermissionsTranslations[permission] || null,
                    active: 0,
                };
            }

            this.$axios
                .$get(`/boards/${this.$route.params.id}/users/${this.userOnEdit.entity.id}/permissions`)
                .then((permissions) => {

                    for (const permission of permissions) {

                        this.userOnEdit.permissions[permission].active = 1;
                    }

                    this.activateModal(this.modal.manageUser);
                });
        },
        addUser(user) {
            if (this.formData.ids.includes(user.id)) {
                return;
            }

            this.formData.ids.push(user.id);
            this.usersToAdd.push(user);
        },
        remove(user) {
            const index = this.formData.ids.indexOf(user.id);

            if (index > -1) {
                this.formData.ids.splice(index, 1);
                console.log(this.usersToAdd.filter((addedUser) => addedUser.id === user.id));

                this.usersToAdd = this.usersToAdd.filter((addedUser) => addedUser.id !== user.id);
            }
        },
        removeUser(user) {
            this.$axios
                .$delete(
                    `/boards/${this.$route.params.id}/users/${user.id}`
                )
                .then((res) => {
                    this.loadUsers();
                    this.deactivateModal(this.modal.manageUser);
                });
        },
        handleUserAdding() {
            this.modal.isLoading = true;

            this.$axios
                .$post(
                    `/boards/${this.$route.params.id}/users`,
                    { formData: this.formData }
                )
                .then((res) => {
                    this.modal.isLoading = false;
                    this.deactivateModal(this.modal.addUsers);
                    this.loadUsers();
                });
        },
    },
};
</script>

<style>
    .tag.md-text {
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 4px 8px;
        font-family: monospace; /* Моноширинный шрифт */
    }
</style>
