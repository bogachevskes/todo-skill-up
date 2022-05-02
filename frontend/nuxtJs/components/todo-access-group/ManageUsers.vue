<template>
    <div>
        <div class="card">
            <div class="card-header">
                <p class="card-header-title">Участники</p>
            </div>
            <div class="card-content" style="padding: 10px">
                <div class="content">
                    <button
                        class="button is-success is-small"
                        @click="activateModal"
                    >
                        Добавить
                    </button>
                    <button
                        v-for="(user, index) in users"
                        :key="index"
                        class="button is-small is-warning mr-1"
                        @click="removeUser(user)"
                    >
                        {{ user.email }}
                    </button>
                </div>
            </div>
        </div>
        <div class="modal" :class="{ 'is-active': isModalActive }">
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
                        {{ user.user_email }}
                    </button>
                    <div v-if="formData.user_emails.length > 0">
                        <p>Пользователи к добавлению:</p>
                        <button
                            v-for="(email, index) in formData.user_emails"
                            :key="index"
                            class="button is-warning mr-1"
                            @click="remove(email)"
                        >
                            {{ email }}
                        </button>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button
                        v-if="formData.user_emails.length > 0"
                        class="button is-success"
                        :class="{ 'is-loading': isLoading }"
                        :disabled="false"
                        @click="handleCardProcessing"
                    >
                        Добавить
                    </button>
                    <button
                        class="button is-danger"
                        :class="{ 'is-hidden': isLoading }"
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
                user_emails: [],
            },
            searchData: {
                email: null,
            },
            isModalActive: false,
            isLoading: false,
            userMatches: [],
        };
    },
    watch: {
        'searchData.email' (value) {
            if (value.length < 5) {
                return;
            }

            this.$axios
                .$get(`/users/match-by-email/${this.searchData.email}`)
                .then((res) => (this.userMatches = res.items));
        },
    },
    methods: {
        activateModal () {
            this.isModalActive = 1;
        },
        deactivateModal () {
            this.isModalActive = 0;
        },
        addUser (user) {
            if (this.formData.user_emails.includes(user.user_email)) {
                return;
            }

            this.formData.user_emails.push(user.user_email);
        },
        remove (email) {
            const index = this.formData.user_emails.indexOf(email);

            if (index > -1) {
                this.formData.user_emails.splice(index, 1);
            }
        },
        removeUser (user) {
            this.$axios
                .$delete(
                    `/todo-access-user-group/${this.$route.params.id}/delete/${user.group_id}`
                )
                .then((res) => {
                    this.loadUsers();
                });
        },
        handleCardProcessing () {
            this.isLoading = true;

            this.$axios
                .$post(
                    `/todo-access-user-group/${this.$route.params.id}/create`,
                    { formData: this.formData }
                )
                .then((res) => {
                    this.isLoading = false;
                    this.deactivateModal();
                    this.loadUsers();
                });
        },
    },
};
</script>

<style></style>
