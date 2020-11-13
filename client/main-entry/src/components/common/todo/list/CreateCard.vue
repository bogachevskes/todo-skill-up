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
                        <div class="control">
                            <input
                                type="date"
                                id="planned_complition_at">
                        </div>
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
        <div class="column is-3 has-background-white">
            <aside class="menu">
                <p class="menu-label">
                    Возможности
                </p>
                <ul class="menu-list">
                    <li class="is-right">
                        <a class="is-active" @click="activateModal('Добавить задачу')">Добавить задачу</a>
                    </li>
                </ul>
            </aside>
        </div>
    </div>
    
</template>

<script>

    import { required, minLength } from 'vuelidate/lib/validators';
    import * as bulmaCalendar from 'bulma-calendar/dist/js/bulma-calendar.min.js';
    import { inputMethods, validationMixinAsset } from '@libs/libStack';
    import axios from '@axios/base';
    import DateHelper from '@helpers/DateHelper';

    export default {
        data: function () {
            return {
                formData: {
                    id: null,
                    name: null,
                    description: null,
                    plannedComplitionAt: null,
                },
                isModalActive: 0,
                modalHeadingText: null,
                lengthRules: {
                    name: 5,
                    description: 10,
                },
            };
        },
        methods: {
            ...inputMethods,
            activateModal: function (modalHeadingText) {
                this.modalHeadingText = modalHeadingText;
                this.isModalActive = 1;
            },
            deactivateModal: function () {
                this.modalHeadingText = null;
                this.isModalActive = 0;
            },
            flushFormData: function () {
                for (const item in this.formData) {
                    this.formData[item] = null;
                }
            },
            handleCardProcessing: function () {
                axios.post('todo/create', {form: this.formData})
                    .then((res) => {
                        this.deactivateModal();
                        this.flushFormData();
                        this.$store.dispatch('updateCardsList', this.$userStorage);
                    });
            },
        },
        mounted: function () {
            const calendar = bulmaCalendar.attach(
                '#planned_complition_at',
                {
                    type: 'date',
                    displayMode: 'dialog',
                    startDate: new Date(),
                    minDate: new Date(),
                    showClearButton: false,
                    todayLabel: 'Сегодня',
                    cancelLabel:'Закрыть',
                    dateFormat: 'DD.MM.YYYY',
                }
            )[0];

            this.formData.plannedComplitionAt = DateHelper.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

            calendar.on('select', (event) => {
                this.formData.planned_complition_at = DateHelper.format(event.data.date, 'YYYY-MM-DD HH:mm:ss');
            })
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

<style lang="scss">

.menu-list li a:hover {
    background: #09bd5a;
}

</style>