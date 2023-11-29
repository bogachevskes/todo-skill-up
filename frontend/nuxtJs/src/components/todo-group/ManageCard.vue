<template>
    <div class="columns">
        <div class="modal" :class="{ 'is-active': isModalActive }">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">{{ modalHeadingText }}</p>
                    <button
                        class="delete"
                        aria-label="close"
                        @click="deactivateModal"
                    ></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">Название задачи</label>
                        <div class="control">
                            <input
                                v-model="formData.name"
                                class="input"
                                placeholder="Сделать невозможное..."
                                @blur="blurField(['formData', 'name'])"
                            />
                        </div>
                        <p
                            v-if="
                                $v.formData.name.$dirty &&
                                !$v.formData.name.required
                            "
                            class="help is-danger"
                        >
                            Обязательно к заполнению
                        </p>
                        <p
                            v-if="
                                $v.formData.name.$error &&
                                $v.formData.name.required
                            "
                            class="help is-danger"
                        >
                            Минимальное кол-во символов: {{ lengthRules.name }}
                        </p>
                    </div>
                    <div class="field">
                        <label class="label">Дата выполнения</label>
                        <b-datepicker v-model="plannedCompletionAt" inline />
                    </div>
                    <div class="columns">
                        <div class="column is-12">
                            <div class="field">
                                <label class="label">Описание задачи</label>
                                <div class="control">
                                    <textarea
                                        v-model="formData.description"
                                        class="textarea"
                                        placeholder="В этой потрясающей задаче я сделаю..."
                                        @blur="
                                            blurField([
                                                'formData',
                                                'description',
                                            ])
                                        "
                                    >
                                    </textarea>
                                </div>
                                <p
                                    v-if="
                                        $v.formData.description.$dirty &&
                                        !$v.formData.description.required
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
                                    Минимальное кол-во символов:
                                    {{ lengthRules.description }}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button
                        class="button is-success"
                        :disabled="$v.$invalid"
                        @click="handleCardProcessing"
                    >
                        Сохранить
                    </button>
                    <button class="button is-danger" @click="deactivateModal">
                        Отменить
                    </button>
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators';
import { inputMethods, validationMixinAsset } from '@/libs/libStack';

import DateHelper from '@/plugins/helpers/DateHelper';
import events from '@/constants/events';

export default {
    mixins: [validationMixinAsset],
    props: {
        loadTodoGroups: {
            type: Function,
            default: null,
        },
    },
    data () {
        return {
            formData: {},
            plannedCompletionAt: null,
            action: null,
            isModalActive: 0,
            lengthRules: {
                name: 5,
                description: 10,
            },
        };
    },
    computed: {
        modalHeadingText () {
            switch (this.action) {
                case 'create':
                    return 'Создать задачу';
                case 'update':
                    return 'Редактировать задачу';
            }

            return 'Не определено';
        },
    },
    mounted () {
        this.$eventBus.$on(events.SHOW_CARD_MANAGE_MODAL, (card, action) => {
            this.action = action;
            this.formData = { ...card };

            if (typeof this.formData.plannedCompletionAt === 'string') {
                this.plannedCompletionAt = new Date(
                    this.formData.plannedCompletionAt
                );
            }

            this.activateModal(action);
        });
    },
    methods: {
        ...inputMethods,
        activateModal () {
            this.isModalActive = 1;
        },
        deactivateModal () {
            this.isModalActive = 0;
        },
        flushFormData () {
            for (const item in this.formData) {
                this.formData[item] = null;
            }
        },
        executeCreation () {
            this.formData.boardId = this.$route.params.id;

            this.formData.plannedCompletionAt = DateHelper.format(
                this.plannedCompletionAt,
                'YYYY-MM-DD HH:mm:ss'
            );

            this.$axios
                .$post(
                    `/todo-group/todo/${this.$route.params.id}/create`,
                    { form: this.formData }
                )
                .then((res) => this.onCardProcessingComplete());
        },
        executeUpdating () {
            this.formData.plannedCompletionAt = DateHelper.format(
                this.plannedCompletionAt,
                'YYYY-MM-DD HH:mm:ss'
            );

            this.$axios
                .$put(
                    `/todo-group/todo/${this.$route.params.id}/update/${this.formData.id}`,
                    { formData: this.formData }
                )
                .then((res) => this.onCardProcessingComplete());
        },
        onCardProcessingComplete () {
            this.deactivateModal();
            this.$v.$reset();
            this.flushFormData();
            this.loadTodoGroups();
        },
        handleCardProcessing () {
            switch (this.action) {
                case 'create':
                    this.executeCreation();
                    return;
                case 'update':
                    this.executeUpdating();
                    return;
            }

            throw new Error('Handling is not defined');
        },
        setComplitionDate (date) {
            this.formData.plannedCompletionAt = DateHelper.format(
                date,
                'YYYY-MM-DD HH:mm:ss'
            );
        },
    },
    validations () {
        return {
            formData: {
                name: {
                    required,
                    minLength: minLength(this.lengthRules.name),
                },
                description: {
                    required,
                    minLength: minLength(this.lengthRules.description),
                },
            },
        };
    },
};
</script>
