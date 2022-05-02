<template>

    <div class="columns">
        <div class="modal" :class="{'is-active': isModalActive}">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">{{ modalHeadingText }}</p>
                <button class="delete" aria-label="close" @click="deactivateModal"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">Название задачи</label>
                        <div class="control">
                            <input
                                class="input"
                                placeholder="Сделать невозможное..."
                                @blur="blurField(['formData', 'name'])"
                                v-model="formData.name">
                        </div>
                        <p
                            class="help is-danger"
                            v-if="($v.formData.name.$dirty && (! $v.formData.name.required))">
                            Обязательно к заполнению
                        </p>
                        <p
                            class="help is-danger"
                            v-if="$v.formData.name.$error && $v.formData.name.required">
                            Минимальное кол-во символов: {{ lengthRules.name }}
                        </p>
                    </div>
                    <div class="field">
                        <label class="label">Дата выполнения</label>
                        <b-datepicker
                            inline
                            v-model="plannedComplitionAt"
                        />
                    </div>
                    <div class="columns">
                        <div class="column is-12">
                            <div class="field">
                                <label class="label">Описание задачи</label>
                                <div class="control">
                                    <textarea
                                        class="textarea"
                                        placeholder="В этой потрясающей задаче я сделаю..."
                                        @blur="blurField(['formData', 'description'])"
                                        v-model="formData.description">
                                    </textarea>
                                </div>
                                <p
                                    class="help is-danger"
                                    v-if="($v.formData.description.$dirty && (! $v.formData.description.required))">
                                    Обязательно к заполнению
                                </p>
                                <p
                                    class="help is-danger"
                                    v-if="$v.formData.description.$error && $v.formData.description.required">
                                    Минимальное кол-во символов: {{ lengthRules.description }}
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
                    <button class="button is-danger" @click="deactivateModal">Отменить</button>
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
        props: {
            loadTodoGroups: {
                type: Function,
                default: null,
            },
        },
        data: function () {
            return {
                formData: {

                },
                plannedComplitionAt: null,
                action: null,
                isModalActive: 0,
                lengthRules: {
                    name: 5,
                    description: 10,
                },
            };
        },
        methods: {
            ...inputMethods,
            activateModal: function () {
                this.isModalActive = 1;
            },
            deactivateModal: function () {
                this.isModalActive = 0;
            },
            flushFormData: function () {
                for (const item in this.formData) {
                    this.formData[item] = null;
                }
            },
            executeCreation: function () {
                
                this.formData.todoAccessGroupId = this.$route.params.id;

                this.formData.plannedComplitionAt = DateHelper.format(this.plannedComplitionAt, 'YYYY-MM-DD HH:mm:ss');
                
                this.$axios.$post(`/todo-access-group/todo/${this.$route.params.id}/create`, {form: this.formData})
                    .then(
                            res => this.onCardProcessingComplete()
                        );
            },
            executeUpdating: function () {
                
                this.formData.plannedComplitionAt = DateHelper.format(this.plannedComplitionAt, 'YYYY-MM-DD HH:mm:ss');
                
                this.$axios.$put(
                    `/todo-access-group/todo/${this.$route.params.id}/update/${this.formData.id}`,
                    { formData: this.formData }
                    )
                    .then(
                            res => this.onCardProcessingComplete()
                        );
            },
            onCardProcessingComplete: function () {
                this.deactivateModal();
                this.$v.$reset();
                this.flushFormData();
                this.loadTodoGroups();
            },
            handleCardProcessing: function () {
                
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
            setComplitionDate: function (date) {
                this.formData.plannedComplitionAt = DateHelper.format(date, 'YYYY-MM-DD HH:mm:ss');
            },
        },
        computed: {
            modalHeadingText: function () {
                switch (this.action) {
                    case 'create':
                        return 'Создать задачу';
                    case 'update':
                        return 'Редактировать задачу';
                }

                return 'Не определено';
            }
        },
        mounted: function () {

            this.$eventBus.$on(events.SHOW_CARD_MANAGE_MODAL, (card, action) => {
                this.action = action;
                this.formData = {...card};

                if (typeof this.formData.plannedComplitionAt === 'string') {
                    this.plannedComplitionAt = new Date(this.formData.plannedComplitionAt);
                }

                this.activateModal(action);
            });

        },
        mixins: [validationMixinAsset],
        validations: function() {
            return {
                formData:{
                    name: {
                        required: required,
                        minLength: minLength(this.lengthRules.name),
                    },
                    description: {
                        required: required,
                        minLength: minLength(this.lengthRules.description),
                    },
                },
            };
        },
    }
</script>