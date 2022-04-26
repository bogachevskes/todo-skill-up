<template>
    <div>
        <div class="field">
            <label for="" class="label">Почта</label>
            <div class="control has-icons-left has-icons-right">
                <b-icon
                    icon="email"
                    size="is-small"
                />
                <input
                    class="input"
                    :class="printIsOnWarning($v.formData.email.$error)"
                    placeholder="example@example.com"
                    @blur="blurField(['formData', 'email'])"
                    v-model="formData.email"
                />
                <b-icon
                    icon="exclamation-thick"
                    size="is-small"
                    style="background-color: #f14668; right:0;"
                    v-if="$v.formData.email.$error"
                />
            </div>
            <p
                    class="help is-danger"
                    v-if="($v.formData.email.$dirty && (! $v.formData.email.required))"
            >
                Обязательно к заполнению
            </p>
            <p
                class="help is-danger"
                v-if="$v.formData.email.$error && $v.formData.email.required"
            >
                Проверьте правильность введенных данных
            </p>
        </div>
        <div class="field">
            <label for="" class="label">Пароль</label>
            <div class="control has-icons-left has-icons-right">
                <b-icon
                    icon="lock"
                    size="is-small"
                />
                <input
                        class="input"
                        :class="printIsOnWarning($v.formData.password.$error)"
                        type="password"
                        placeholder="*******"
                        @blur="blurField(['formData','password'])"
                        v-model="formData.password"
                />
                <b-icon
                    icon="exclamation-thick"
                    size="is-small"
                    style="background-color: #f14668; right:0;"
                    v-if="$v.formData.password.$error"
                />
            </div>
            <p
                class="help is-danger"
                v-if="($v.formData.password.$dirty && (! $v.formData.password.required))"
            >
                Обязательно к заполнению
            </p>
            <p
                class="help is-danger"
                v-if="$v.formData.password.$error && $v.formData.password.required"
            >
                Минимальное кол-во символов: {{ getPasswordMinLength }}
            </p>
        </div>
        <button
            class="button is-success mt-1"
            :class="{'is-loading': isLoading}"
            :disabled="isValid === false"
            @click="login"
        >
            Войти
        </button>
    </div>
</template>

<script>
    import { required, email, minLength } from 'vuelidate/lib/validators';
    
    import { inputMethods, inputComputedMethods, validationMixinAsset } from '@/libs/libStack';

    export default {
        data: function () {
            return {
                formData: {
                    email: null,
                    password: null,
                },
                isLoading: false,
            };
        },
        methods: {
            ...inputMethods,
            clearInputs: function () {
                for (let field in this.formData) {
                    this[field] = null;
                }

                return this;
            },
            login: function () {
                this.isLoading = true;

                this.$axios.$post('auth/login', this.formData)
                    .then(result => {

                        this.$userStorage.fillStorage(result);
                        this.$userStorage.setClientCookies(result);
                        
                        this.isLoading = false;

                        this.$store.dispatch('todoes/setUserData', this.$userStorage.getUserData());

                        this.$store.dispatch('todoes/updateToken');
                        this.$store.dispatch('todoes/updatePermissions', this.$userStorage);
                        this.$store.dispatch('todoes/updateTodoAccessGroups', this.$userStorage);

                        this.$router.push('/todo-list');

                        return this;
                    })
                    .catch(error => {

                        console.log(error);

                        this.isLoading = false;

                        const errorData = error.response.data;

                        this.$eventBus.showError(
                                'Ошибка при авторизации',
                                errorData.message
                            );

                        return this;
                    });
            }
        },
        computed: {
            ...inputComputedMethods,
            isValid: function () {
                if (this.$v.formData.email.$invalid || this.$v.formData.password.$invalid) {
                    return false;
                }

                return true;
            },
        },
        mixins: [validationMixinAsset],
        /** лучше использовать функцией, можно использовать контекст vue */
        validations: function() {
            return {
                formData:{
                    email: {
                        required: required,
                        email: email,
                    },
                    password: {
                        required,
                        minLength: minLength(this.getPasswordMinLength),
                    },
                },
            }
        },
    }
</script>