<template>
    <div>
        <div class="field">
            <label for="" class="label">Ваше имя</label>
            <div class="control has-icons-left has-icons-right">
                <b-icon
                    icon="account"
                    size="is-small"
                />
                <input
                        class="input"
                        :class="printIsOnWarning($v.formData.name.$error)"
                        placeholder="Джимми"
                        @blur="blurField(['formData', 'name'])"
                        v-model="formData.name"
                />
                <b-icon
                    icon="exclamation-thick"
                    size="is-small"
                    style="background-color: #f14668; right:0;"
                    v-if="$v.formData.name.$error"
                />
            </div>
            <p
                class="help is-danger"
                v-if="($v.formData.name.$dirty && (! $v.formData.name.required))"
            >
                Обязательно к заполнению
            </p>
            <p
                class="help is-danger"
                v-if="$v.formData.name.$error && $v.formData.name.required"
            >
                Минимальное кол-во символов: {{ getNameMinLength }}
            </p>
        </div>
        <div class="field">
            <label for="" class="label">Почта</label>
            <div class="control has-icons-left has-icons-right">
                <!-- @blur когда ушел фокус с инпута -->
                <!-- .$touch() можно вызывать в любом месте, когда нужно -->
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
        <div class="field">
            <label for="" class="label">Подтвердите пароль</label>
            <div class="control has-icons-left has-icons-right">
                <b-icon
                    icon="lock"
                    size="is-small"
                />
                <input
                    class="input"
                    :class="printIsOnWarning($v.formData.confirm_password.$error)"
                    type="password"
                    placeholder="*******"
                    @blur="blurField(['formData', 'confirm_password'])"
                    v-model="formData.confirm_password"
                />
                <b-icon
                    icon="exclamation-thick"
                    size="is-small"
                    style="background-color: #f14668; right:0;"
                    v-if="$v.formData.confirm_password.$error"
                />
            </div>
            <p
                class="help is-danger"
                v-if="$v.formData.confirm_password.$dirty && $v.formData.confirm_password.$error"
            >
                Пароли не совпадают
            </p>
        </div>
        <div class="field">
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
            class="button is-primary mt-1"
            :class="{'is-loading': isLoading}"
            :disabled="registerValid === false || isLoading === true"
            @click="signup"
        >
            Регистрироваться
        </button>
    </div>
</template>

<script>
    import { required, email, minLength, sameAs } from 'vuelidate/lib/validators';
    
    import { inputMethods, inputComputedMethods, validationMixinAsset } from '@/libs/libStack';

    export default {
        data: function () {
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
        methods: {
            ...inputMethods,
            clearInputs: function () {
                for (let field in this.formData) {
                    this[field] = null;
                }

                return this;
            },
            signup: function () {
                
                this.isLoading = true;
                
                this.$axios.$put('auth/signup', this.formData)
                    .then(result => {
                        
                        this.isLoading = false;

                        this.clearInputs();
                        this.$router.push('login');
                        this.$eventBus.showSuccess(
                                'Вы зарегистрировались в системе',
                                'Войдите в систему, используя учетные данные',
                            );
                    })
                    .catch(error => {
                        
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
        computed: {
            ...inputComputedMethods,
            loginValid: function () {
                if (this.$v.formData.email.$invalid || this.$v.formData.password.$invalid) {
                    return false;
                }

                return true;
            },
            registerValid: function () {
                return Boolean(this.$v.$invalid) === false;
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
    }
</script>