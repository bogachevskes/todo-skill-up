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
                            class="button is-success is-small mt-1"
                            @click="activateModal"
                        >
                            Добавить
                        </button>
                        <button
                            v-for="(user, index) in users"
                            :key="index"
                            class="button is-small is-warning mr-1 mt-1"
                            @click="removeUser(user)"
                            :disabled="Number(user.id) === Number(getUserId)"
                        >
                            {{ Number(user.id) === Number(getUserId) ? 'Вы' : user.email }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal" :class="{ 'is-active': modal.isActive }">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Добавить участника</p>
                    <button
                        class="delete"
                        aria-label="close"
                        @click="deactivateModal"
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
                        :class="{ 'is-loading': modal.isLoading }"
                        :disabled="false"
                        @click="handleUserAdding"
                    >
                        Добавить
                    </button>
                    <button
                        class="button is-danger"
                        :class="{ 'is-hidden': modal.isLoading }"
                        @click="deactivateModal"
                    >
                        Отменить
                    </button>
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
        loadUsers: {
            type: Function,
            default: null,
        },
    },
    data () {
        return {
            formData: {
                ids: [],
            },
            searchData: {
                email: null,
            },
            modal: {
                isActive: false,
                isLoading: false,
            },
            userMatches: [],
            usersToAdd: [],
        };
    },
    computed: {
        ...mapGetters('user', ['getUserId']),
    },
    watch: {
        'searchData.email' (value) {
            if (value.length < 5) {
                return;
            }

            this.$axios
                .$get(`/users/match/?email=${this.searchData.email}`)
                .then((res) => (this.userMatches = res.items));
        },
    },
    methods: {
        activateModal() {
            this.modal.isActive = true;
        },
        deactivateModal () {
            this.modal.isActive = 0;
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
                    this.deactivateModal();
                    this.loadUsers();
                });
        },
    },
};
</script>

<style></style>
