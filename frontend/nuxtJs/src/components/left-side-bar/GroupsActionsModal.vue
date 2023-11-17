<template>
    <div class="modal" :class="{ 'is-active': modal.isActive }">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Добавить доску</p>
                <button
                    class="delete"
                    aria-label="close"
                    @click="modal.isActive = false"
                ></button>
            </header>
            <section class="modal-card-body">
                <div class="field">
                    <label class="label">Название</label>
                    <div class="control">
                        <input
                            v-model="formData.name"
                            class="input"
                            placeholder="Название"
                            @blur="blurField(['formData', 'name'])"
                        />
                    </div>
                    <p
                        v-if="
                            $v.formData.name.$dirty &&
                            $v.formData.name.required === false
                        "
                        class="help is-danger"
                    >
                        Обязательно к заполнению
                    </p>
                    <p
                        v-if="
                            $v.formData.name.$error && $v.formData.name.required
                        "
                        class="help is-danger"
                    >
                        Минимальное кол-во символов: {{ INPUT_MIN_LENGTH }}
                    </p>
                </div>
                <div class="field">
                    <label class="label">Описание</label>
                    <div class="control">
                        <input
                            v-model="formData.description"
                            class="input"
                            placeholder="Описание"
                            @blur="blurField(['formData', 'description'])"
                        />
                    </div>
                    <p
                        v-if="
                            $v.formData.description.$dirty &&
                            $v.formData.description.required === false
                        "
                        class="help is-danger"
                    >
                        Обязательно к заполнению
                    </p>
                    <p
                        v-if="
                            $v.formData.description.$error &&
                            $v.formData.description.required
                        "
                        class="help is-danger"
                    >
                        Минимальное кол-во символов: {{ INPUT_MIN_LENGTH }}
                    </p>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button
                    class="button is-success"
                    :class="{ 'is-loading': isLoading }"
                    :disabled="
                        $v.formData.name.$invalid === true ||
                        $v.formData.description.$invalid === true
                    "
                    @click="handleCardProcessing"
                >
                    {{ mode === 'create' ? 'Добавить' : 'Изменить' }}
                </button>
                <button
                    class="button is-danger"
                    :class="{ 'is-hidden': isLoading }"
                    @click="modal.isActive = false"
                >
                    Отменить
                </button>
            </footer>
        </div>
    </div>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators';
import { inputMethods, validationMixinAsset } from '@/libs/libStack';

export default {
    mixins: [validationMixinAsset],
    props: {
        groupId: {
            type: Number,
            default: null,
        },
        modal: {
            type: Object,
            default: false,
        },
        mode: {
            type: String,
            default: 'create',
        },
        beforeAction: {
            type: Function,
            default: (state) => {},
        },
        afterAction: {
            type: Function,
            default: (state) => {},
        },
    },
    data () {
        return {
            INPUT_MIN_LENGTH: 5,
            isLoading: false,
            formData: {
                name: null,
                description: null,
            },
        };
    },
    watch: {
        'modal.isActive' (value) {
            if (value === true) {
                this.beforeAction(this);


            }
        },
    },
    methods: {
        ...inputMethods,
        flushFormData () {
            for (const item in this.formData) {
                this.formData[item] = null;
            }
        },
        onCardProcessingComplete () {
            this.isLoading = false;
            this.modal.isActive = false;
            this.$v.$reset();
            this.flushFormData();
            this.$store.dispatch(
                'todo/updateTodoGroups',
                this.$userStorage
            );
            this.afterAction(this);
        },
        handleCardProcessing () {
            this.isLoading = true;

            const actions = {
                create: () => {
                    this.$axios
                        .$post(`/todo-group/create`, {
                            formData: this.formData,
                        })
                        .then(() => this.onCardProcessingComplete());
                },
                update: () => {
                    this.$axios
                        .$put(`/todo-group/update/${this.groupId}`, {
                            formData: this.formData,
                        })
                        .then(() => {
                            this.onCardProcessingComplete();

                            delete this.formData.id;
                        });
                },
            };

            if (this.mode in actions === false) {
                throw new Error('Режим обработки не установлен');
            }

            actions[this.mode]();
        },
    },
    validations () {
        return {
            formData: {
                name: {
                    required,
                    minLength: minLength(this.INPUT_MIN_LENGTH),
                },
                description: {
                    required,
                    minLength: minLength(this.INPUT_MIN_LENGTH),
                },
            },
        };
    },
};
</script>

<style></style>
