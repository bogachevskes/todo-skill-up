<template>
    <div class="column is-4">
        <h1 class="title has-text-white">{{ actionHeading }}</h1>
        <div class="box">
            <div class="field">
                <label for="" class="label">Имя</label>
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
                    <b-icon icon="email" size="is-small" />
                    <input
                        v-model="formData.email"
                        class="input"
                        :class="printIsOnWarning($v.formData.email.$error)"
                        :disabled="emailDisabled"
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
                    v-if="
                        $v.formData.email.$dirty && !$v.formData.email.required
                    "
                    class="help is-danger"
                >
                    Обязательно к заполнению
                </p>
                <p
                    v-if="
                        $v.formData.email.$error && $v.formData.email.required
                    "
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
                        :placeholder="
                            formData.hasPassword
                                ? 'Пароль установлен'
                                : '*******'
                        "
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
                        $v.formData.password.$error &&
                        $v.formData.password.required
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
                            printIsOnWarning(
                                $v.formData.confirm_password.$error
                            )
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
            <button
                v-if="confirmAction"
                class="button is-success mt-1"
                :class="{ 'is-loading': onLoading }"
                :disabled="!formDataValid"
                @click="submit()"
            >
                {{ actionText }}
            </button>
        </div>
    </div>
</template>

<script>
import {
    required,
    email,
    minLength,
    sameAs,
} from 'vuelidate/lib/validators';

import {
    inputMethods,
    inputComputedMethods,
    validationMixinAsset,
} from '@/libs/libStack';

export default {
    mixins: [validationMixinAsset],
    props: {
        formData: {
            type: Object,
            default () {
                return {
                    name: null,
                    email: null,
                    password: null,
                    confirm_password: null,
                };
            },
        },
        emailDisabled: {
            type: Boolean,
            default: false,
        },
        passwordStrictRequired: {
            type: Boolean,
            default: true,
        },
        actionHeading: {
            type: String,
        },
        actionText: {
            type: String,
        },
        confirmAction: {
            type: Function,
            default: null,
        },
    },
    data () {
        return {
            onLoading: false,
        };
    },
    computed: {
        ...inputComputedMethods,
        formDataValid () {
            return !this.$v.$invalid;
        },
    },
    methods: {
        ...inputMethods,
        submit () {
            this.confirmAction(this.formData);
        },
    },
    watch: {
        'formData.email': function(newEmail) {
            this.formData.email = newEmail.toLowerCase();
        },
    },
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
                    required (value) {
                        if (this.passwordStrictRequired) {
                            return Boolean(value);
                        }

                        if (value) {
                            return required;
                        }

                        return true;
                    },
                    minLength: minLength(this.getPasswordMinLength),
                },
                confirm_password: {
                    sameAs: sameAs((x) => this.formData.password),
                },
            },
        };
    },
};
</script>

<style></style>
