<template>
    <div class="container">
        <div class="columns">
            <div class="column is-6">
                <h1 class="title">{{ actionHeading }}</h1>
                <div class="box">
                    <div class="field">
                        <label for="" class="label">Имя</label>
                        <div class="control has-icons-left has-icons-right">
                            <input
                                class="input"
                                :class="printIsOnWarning($v.formData.name.$error)"
                                placeholder="Джимми"
                                @blur="blurField(['formData', 'name'])"
                                v-model="formData.name"
                            >
                            <span class="icon is-small is-left">
                                <font-awesome-icon icon="user" />
                            </span>
                            <span
                                class="icon is-small is-right"
                                v-if="$v.formData.name.$error"
                            >
                                <font-awesome-icon icon="exclamation-triangle" />
                            </span>
                        </div>
                        <p
                            class="help is-danger"
                            v-if="($v.formData.name.$dirty && (! $v.formData.name.required))"
                        >Обязательно к заполнению</p>
                        <p
                            class="help is-danger"
                            v-if="$v.formData.name.$error && $v.formData.name.required"
                        >
                            Минимальное кол-во символов: {{ getNameMinLength }}
                            <br>
                            Только буквы и цифры
                        </p>
                    </div>
                    <div class="field">
                        <label for="" class="label">Почта</label>
                        <div class="control has-icons-left has-icons-right">
                            <input
                                class="input"
                                :class="printIsOnWarning($v.formData.email.$error)"
                                placeholder="example@example.com"
                                @blur="blurField(['formData', 'email'])"
                                v-model="formData.email"
                            >
                            <span class="icon is-small is-left">
                                <font-awesome-icon icon="envelope" />
                            </span>
                            <span
                                class="icon is-small is-right"
                                v-if="$v.formData.email.$error"
                            >
                                <font-awesome-icon icon="exclamation-triangle" />
                            </span>
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
                            <input
                                class="input"
                                :class="printIsOnWarning($v.formData.password.$error)"
                                type="password"
                                :placeholder="formData.hasPassword ? 'Пароль установлен' : '*******'"
                                @blur="blurField(['formData','password'])"
                                v-model="formData.password"
                            >
                            <span class="icon is-small is-left">
                                <font-awesome-icon icon="lock" />
                            </span>
                            <span
                                class="icon is-small is-right"
                                v-if="$v.formData.password.$error"
                            >
                                <font-awesome-icon icon="exclamation-triangle" />
                            </span>
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
                    <div class="field">
                        <label for="" class="label">Подтвердите пароль</label>
                        <div class="control has-icons-left has-icons-right">
                            <input
                                class="input"
                                :class="printIsOnWarning($v.formData.confirm_password.$error)"
                                type="password"
                                placeholder="*******"
                                @blur="blurField(['formData', 'confirm_password'])"
                                v-model="formData.confirm_password"
                            >
                            <span class="icon is-small is-left">
                                <font-awesome-icon icon="lock" />
                            </span>
                            <span
                                class="icon is-small is-right"
                                v-if="$v.formData.password.$error"
                            >
                                <font-awesome-icon icon="exclamation-triangle" />
                            </span>
                        </div>
                        <p
                            class="help is-danger"
                            v-if="$v.formData.confirm_password.$dirty && $v.formData.confirm_password.$error"
                        >
                            Пароли не совпадают
                        </p>
                    </div>
                    <button
                        v-if="confirmAction"
                        class="button is-success mt-1"
                        :class="{'is-loading': onLoading}"
                        :disabled="(! formDataValid)"
                        @click="submit()"
                    >
                        {{ actionText }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { required, email, minLength, sameAs, alphaNum } from 'vuelidate/lib/validators';
    import axios from '@axios/base';

    import { inputMethods, inputComputedMethods, validationMixinAsset } from '@libs/libStack';

    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faEnvelope, faLock, faExclamationTriangle, faUser } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    
    library.add(faEnvelope, faLock, faExclamationTriangle, faUser);
    
    export default {
        props: {
            formData: {
                type: Object,
                default: function () {
                    return {
                        name: null,
                        email: null,
                        password: null,
                        confirm_password: null,
                    }
                },
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
        data: function () {
            return {
                onLoading: false,
            };
        },
        methods: {
            ...inputMethods,
            submit: function () {
                this.confirmAction(this.formData);
            },
        },
        computed: {
            ...inputComputedMethods,
            formDataValid: function () {
                return (! this.$v.$invalid);
            },
        },
        mixins: [validationMixinAsset],
        validations: function() {
            return {
                formData:{
                    name: {
                        required: required,
                        alphaNum: alphaNum,
                        minLength: minLength(this.getNameMinLength),
                    },
                    email: {
                        required: required,
                        email: email,
                    },
                    password: {
                        required: function (value) {
                            if (this.passwordStrictRequired) {
                                return Boolean(value);
                            }

                            if (Boolean(value)) {
                                return required;
                            }

                            return true;
                        },
                        minLength: minLength(this.getPasswordMinLength),
                    },
                    confirm_password: {
                        
                        sameAs: sameAs(x => this.formData.password),
                    },
                },
            }
        },
        components: {
            'font-awesome-icon': FontAwesomeIcon,
        },
    }
</script>

<style>

</style>