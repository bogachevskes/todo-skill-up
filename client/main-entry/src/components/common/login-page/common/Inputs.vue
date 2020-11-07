<template>
    <div>
        <div class="field" v-if="(! isOnLogin)">
            <label for="" class="label">Ваше имя</label>
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
                >Минимальное кол-во символов: {{ getNameMinLength }}</p>
        </div>
        <div class="field">
            <label for="" class="label">Почта</label>
            <div class="control has-icons-left has-icons-right">
                <!-- @blur когда ушел фокус с инпута -->
                <!-- .$touch() можно вызывать в любом месте, когда нужно -->
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
                >Обязательно к заполнению</p>
            <p
                    class="help is-danger"
                    v-if="$v.formData.email.$error && $v.formData.email.required"
                >Проверьте правильность введенных данных</p>
        </div>
        <div class="field">
            <label for="" class="label">Пароль</label>
            <div class="control has-icons-left has-icons-right">
                <input
                        class="input"
                        :class="printIsOnWarning($v.formData.password.$error)"
                        type="password"
                        placeholder="*******"
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
                >Обязательно к заполнению</p>
            <p
                    class="help is-danger"
                    v-if="$v.formData.password.$error && $v.formData.password.required"
                >Минимальное кол-во символов: {{ getPasswordMinLength }}</p>
        </div>
        <div class="field" v-if="(! isOnLogin)">
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
            >Пароли не совпадают</p>
        </div>
        <div class="field" v-if="(! isOnLogin)">
            <label for="" class="checkbox">
                <input
                    type="checkbox"
                    @change="blurField('terms_agree')"
                    v-model="terms_agree"
                >
                Принимаю <a href="#">условия пользования сервисом.</a>
            </label>
            <p
                class="help is-danger"
                v-if="$v.terms_agree.$dirty && $v.terms_agree.$error"
            >Для регистрации необходимо<br>ваше согласие с условиями сервиса</p>
        </div>
        <button
            class="button is-success mt-1"
            :class="{'is-loading': onLoginLoading}"
            :disabled="(! loginValid)"
            v-if="isOnLogin"
            @click="login"
        >
            Войти
        </button>
        <button
            class="button is-primary mt-1"
            :class="{'is-loading': onSignupLoading}"
            :disabled="(! registerValid || onSignupLoading)"
            v-if="(! isOnLogin)"
            @click="signup"
        >
            Регистрироваться
        </button>
    </div>
</template>

<script>
    import { required, email, minLength, sameAs } from 'vuelidate/lib/validators';
    import { mapGetters } from 'vuex';
    import axios from '@axios/base';

    import {eventBus} from '@store/eventBus';
    
    import { inputMethods, inputComputedMethods, validationMixinAsset, filterErrorResponseDetails } from '@libs/libStack';

    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faEnvelope, faLock, faExclamationTriangle, faUser } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    
    library.add(faEnvelope, faLock, faExclamationTriangle, faUser);

    export default {
        props: ['mode'],
        data: function () {
            return {
                formData: {
                    name: null,
                    email: null,
                    password: null,
                    confirm_password: null,
                },
                terms_agree: false,
                onSignupLoading: false,
                onLoginLoading: false,
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
            signup: function () {
                this.setOnLoading('onSignupLoading');
                
                axios.put('auth/signup', this.formData)
                    .then(result => {
                        this.setOffLoading('onSignupLoading');
                        this.clearInputs();
                        this.$router.push('login');
                        eventBus.showSuccess(
                                'Вы зарегистрировались в системе',
                                'Войдите в систему, используя учетные данные',
                            );
                    })
                    .catch(error => {
                        this.setOffLoading('onSignupLoading');
                        eventBus.showError(error, 'Ошибка при попытке регистрации');
                    });

                return this;
            },
            login: function () {
                this.setOnLoading('onLoginLoading');
                
                axios.post('auth/login', this.formData)
                    .then(result => {
                        this.$userStorage.fillStorage(result.data);
                        
                        this.setOffLoading('onLoginLoading');

                        this.$store.dispatch('setUserData', this.$userStorage.getUserData());
                        
                        this.$router.push('/');

                        return this;
                    })
                    .catch(error => {
                        this.setOffLoading('onLoginLoading');
                        eventBus.showError(error, 'Ошибка входа');

                        return this;
                    });
            }
        },
        computed: {
            ...inputComputedMethods,
            isOnLogin: function () {
                if (this.mode == 'login') {
                    return true;
                }

                return false;
            },
            loginValid: function () {
                if (this.$v.formData.email.$invalid || this.$v.formData.password.$invalid) {
                    return false;
                }

                return true;
            },
            registerValid: function () {
                return (! this.$v.$invalid);
            },
        },
        mixins: [validationMixinAsset],
        /** лучше использовать функцией, можно использовать контекст vue */
        validations: function() {
            return {
                formData:{
                    name: {
                        required: required,
                        minLength: minLength(this.getNameMinLength),
                    },
                    email: {
                        required: required,
                        email: email,
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
                    sameAs: sameAs( () => true ),
                }
            }
        },
        components: {
            'font-awesome-icon': FontAwesomeIcon,
        },
    }
</script>