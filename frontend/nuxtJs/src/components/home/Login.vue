<template>
    <div>
        <h1 class="title">Вход</h1>
        <div class="box" style="min-width: 380px">
            <div>
                <div class="field">
                    <label for="" class="label">Почта</label>
                    <div class="control has-icons-left has-icons-right">
                        <b-icon icon="email" size="is-small" />
                        <input
                            v-model="formData.email"
                            class="input"
                            :class="printIsOnWarning($v.formData.email.$error)"
                            placeholder="example@example.com"
                            @blur="blurField(['formData', 'email'])"
                        />
                        <b-icon
                            v-if="$v.formData.email.$error"
                            icon="exclamation-thick"
                            size="is-small"
                            style="background-color: #f14668; right: 0"
                        />
                    </div>
                    <p
                        v-if="$v.formData.email.$dirty && !$v.formData.email.required"
                        class="help is-danger"
                    >
                        Обязательно к заполнению
                    </p>
                    <p
                        v-if="$v.formData.email.$error && $v.formData.email.required"
                        class="help is-danger"
                    >
                        Проверьте правильность введенных данных
                    </p>
                </div>
                <div class="field">
                    <label for="" class="label">Пароль</label>
                    <div class="control has-icons-left has-icons-right">
                        <b-icon icon="lock" size="is-small" />
                        <input
                            v-model="formData.password"
                            class="input"
                            :class="printIsOnWarning($v.formData.password.$error)"
                            type="password"
                            placeholder="*******"
                            @blur="blurField(['formData', 'password'])"
                        />
                        <b-icon
                            v-if="$v.formData.password.$error"
                            icon="exclamation-thick"
                            size="is-small"
                            style="background-color: #f14668; right: 0"
                        />
                    </div>
                    <p
                        v-if="
                    $v.formData.password.$dirty &&
                    !$v.formData.password.required
                "
                        class="help is-danger"
                    >
                        Обязательно к заполнению
                    </p>
                    <p
                        v-if="
                    $v.formData.password.$error && $v.formData.password.required
                "
                        class="help is-danger"
                    >
                        Минимальное кол-во символов: {{ getPasswordMinLength }}
                    </p>
                </div>
                <button
                    class="button is-success mt-1"
                    :class="{ 'is-loading': isLoading }"
                    :disabled="isValid === false"
                    @click="login"
                >
                    Войти
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators';

import {
    inputMethods,
    inputComputedMethods,
    validationMixinAsset,
} from '@/libs/libStack';

export default {
    mixins: [validationMixinAsset],
    data () {
        return {
            formData: {
                email: null,
                password: null,
            },
            isLoading: false,
        };
    },
    computed: {
        ...inputComputedMethods,
        isValid () {
            if (
                this.$v.formData.email.$invalid ||
                this.$v.formData.password.$invalid
            ) {
                return false;
            }

            return true;
        },
    },
    methods: {
        ...inputMethods,
        clearInputs () {
            for (const field in this.formData) {
                this[field] = null;
            }

            return this;
        },
        login () {
            this.isLoading = true;

            this.$axios
                .$post('/auth/signin', {formData: {...this.formData}})
                .then((result) => {
                    this.$userStorage.fillStorage(result);
                    this.$userStorage.setClientCookies(result);

                    this.isLoading = false;

                    this.$store.dispatch(
                        'user/setUserData',
                        this.$userStorage.getUserData()
                    );

                    this.$store.dispatch('user/updateToken');
                    this.$store.dispatch(
                        'user/updatePermissions',
                        this.$userStorage
                    );

                    return this;
                })
                .catch((error) => {
                    this.isLoading = false;

                    if (error.response.data.type === 'BadRequest') {
                        this.$eventBus.showError(
                            'Ошибка при авторизации',
                            error.response.data.cause
                        );

                        return;
                    }

                    return this;
                });
        },
    },
    watch: {
        'formData.email': function(newEmail) {
            this.formData.email = newEmail.toLowerCase();
        },
    },
    /** лучше использовать функцией, можно использовать контекст vue */
    validations () {
        return {
            formData: {
                email: {
                    required,
                    email,
                },
                password: {
                    required,
                    minLength: minLength(this.getPasswordMinLength),
                },
            },
        };
    },
};
</script>
