<template>
    <div>
        <h1 class="title">Регистрация</h1>
        <div class="box" style="min-width: 380px">
            <div>
                <div class="field">
                    <label for="" class="label">Ваше имя</label>
                    <div class="control has-icons-left has-icons-right">
                        <b-icon icon="account" size="is-small" />
                        <input
                            v-model="formData.name"
                            class="input"
                            :class="printIsOnWarning($v.formData.name.$error)"
                            placeholder="Джимми"
                            @blur="blurField(['formData', 'name'])"
                        />
                        <b-icon
                            v-if="$v.formData.name.$error"
                            icon="exclamation-thick"
                            size="is-small"
                            style="background-color: #f14668; right: 0"
                        />
                    </div>
                    <p
                        v-if="$v.formData.name.$dirty && !$v.formData.name.required"
                        class="help is-danger"
                    >
                        Обязательно к заполнению
                    </p>
                    <p
                        v-if="$v.formData.name.$error && $v.formData.name.required"
                        class="help is-danger"
                    >
                        Минимальное кол-во символов: {{ getNameMinLength }}
                    </p>
                    <p
                        v-if="$v.formData.name.required === true && $v.formData.name.regex === false"
                        class="help is-danger"
                    >
                        Имя введено некорректно. Попробуйте другое имя
                    </p>
                </div>
                <div class="field">
                    <label for="" class="label">Почта</label>
                    <div class="control has-icons-left has-icons-right">
                        <!-- @blur когда ушел фокус с инпута -->
                        <!-- .$touch() можно вызывать в любом месте, когда нужно -->
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
                <div class="field">
                    <label for="" class="label">Подтвердите пароль</label>
                    <div class="control has-icons-left has-icons-right">
                        <b-icon icon="lock" size="is-small" />
                        <input
                            v-model="formData.confirm_password"
                            class="input"
                            :class="
                        printIsOnWarning($v.formData.confirm_password.$error)
                    "
                            type="password"
                            placeholder="*******"
                            @blur="blurField(['formData', 'confirm_password'])"
                        />
                        <b-icon
                            v-if="$v.formData.confirm_password.$error"
                            icon="exclamation-thick"
                            size="is-small"
                            style="background-color: #f14668; right: 0"
                        />
                    </div>
                    <p
                        v-if="
                    $v.formData.confirm_password.$dirty &&
                    $v.formData.confirm_password.$error
                "
                        class="help is-danger"
                    >
                        Пароли не совпадают
                    </p>
                </div>
                <div class="field">
                    <label for="" class="checkbox">
                        <input
                            v-model="terms_agree"
                            type="checkbox"
                            @change="blurField('terms_agree')"
                        />
                        Принимаю <a href="#">условия пользования сервисом.</a>
                    </label>
                    <p
                        v-if="$v.terms_agree.$dirty && $v.terms_agree.$error"
                        class="help is-danger"
                    >
                        Для регистрации необходимо<br />ваше согласие с условиями
                        сервиса
                    </p>
                </div>
                <button
                    class="button is-primary mt-1"
                    :class="{ 'is-loading': isLoading }"
                    :disabled="registerValid === false || isLoading === true"
                    @click="signup"
                >
                    Регистрироваться
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators';

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
                name: null,
                email: null,
                password: null,
                confirm_password: null,
            },
            terms_agree: false,
            isLoading: false,
        };
    },
    computed: {
        ...inputComputedMethods,
        registerValid () {
            return Boolean(this.$v.$invalid) === false;
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
        signup () {
            this.isLoading = true;

            this.$axios
                .$put('/auth/signup', {formData: {...this.formData}})
                .then((result) => {
                    this.isLoading = false;

                    this.clearInputs();

                    this.$store.dispatch(
                        'invite/setOnRegistration',
                        false
                    );

                    this.$eventBus.showSuccess(
                        'Вы зарегистрировались в системе',
                        'Войдите в систему, используя учетные данные'
                    );
                })
                .catch((error) => {
                    this.isLoading = false;

                    const errorData = error.response.data;

                    this.$eventBus.showError(
                        'Ошибка при попытке регистрации',
                        errorData.message
                    );
                });

            return this;
        },
    },
    /** лучше использовать функцией, можно использовать контекст vue */
    validations () {
        return {
            formData: {
                name: {
                    required,
                    minLength: minLength(this.getNameMinLength),
                    regex: () => {
                        return new RegExp(/^(?:[a-zA-Zа-яА-Я0-9_]+ ?)+[a-zA-Zа-яА-Я0-9_]+$/).test(this.formData.name);
                    },
                },
                email: {
                    required,
                    email,
                },
                password: {
                    required,
                    minLength: minLength(this.getPasswordMinLength),
                },
                confirm_password: {
                    // или просто sameAs('password')
                    sameAs: sameAs(() => {
                        /**
                         * vm - vue instance
                         * vm.password + 'b'; возможность изменять сравниваемое значение из проперти
                         */

                        return this.formData.password;
                    }),
                },
            },
            terms_agree: {
                sameAs: sameAs(() => true),
            },
        };
    },
};
</script>
