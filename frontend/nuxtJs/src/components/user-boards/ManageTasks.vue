<template>
    <div class="columns">
        <div class="modal" :class="{ 'is-active': modal.isActive }">
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
                        @click="handleTaskProcessing"
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
import TaskStatus from "@/plugins/models/TaskStatus";

export default {
    mixins: [validationMixinAsset],
    props: {
        taskStatus: {
            type: TaskStatus,
        },
        loadTaskStatusGroups: {
            type: Function,
            default: null,
        },
    },
    data () {
        return {
            formData: {},
            plannedCompletionAt: null,
            action: 'create',
            modal: {
                isActive: false,
            },
            lengthRules: {
                name: 5,
                description: 10,
            },
        };
    },
    computed: {
        modalHeadingText () {

            const labels = {
                'create': 'Создать задачу',
                'update': 'Редактировать задачу',
            };

            if (labels.hasOwnProperty(this.action)) {
                return labels[this.action];
            }

            throw new Error('Заголовок модального окна не определен');
        },
    },
    mounted () {
        this.$eventBus.$on(events.SHOW_TASK_MANAGE_MODAL, (task, action) => {
            this.action = action;
            this.formData = { ...task };

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
        activateModal() {
            this.modal.isActive = true;
        },
        deactivateModal () {
            this.modal.isActive = false;
        },
        flushFormData() {
            for (const item in this.formData) {
                this.formData[item] = null;
            }
        },
        executeCreation() {
            this.formData.plannedCompletionAt = DateHelper.format(
                this.plannedCompletionAt,
                'YYYY-MM-DD HH:mm:ss'
            );

            this.$axios
                .$post(
                    `/boards/${this.$route.params.id}/tasks`,
                    { formData: this.formData }
                )
                .then((res) => this.onTaskProcessingComplete());
        },
        executeUpdating() {
            this.formData.plannedCompletionAt = DateHelper.format(
                this.plannedCompletionAt,
                'YYYY-MM-DD HH:mm:ss'
            );

            this.$axios
                .$put(
                    `/boards/${this.$route.params.id}/tasks/${this.formData.id}`,
                    { formData: this.formData }
                )
                .then((res) => this.onTaskProcessingComplete());
        },
        onTaskProcessingComplete() {
            this.deactivateModal();
            this.$v.$reset();
            this.flushFormData();
            this.loadTaskStatusGroups();
        },
        handleTaskProcessing() {

            const actions = {
                'create': 'executeCreation',
                'update': 'executeUpdating',
            };

            if (actions.hasOwnProperty(this.action)) {

                return this[actions[this.action]]();
            }

            throw new Error('Обработчик задания не определен');
        },
    },
    validations() {
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
