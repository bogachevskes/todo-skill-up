<template>
    <div class="container is-marginless">
        <h1 class="title is-size-1">Доски</h1>
        <div class="columns">
            <div class="column is-12">
                <button class="button is-success" @click="handleCreate()">Создать доску</button>
            </div>
        </div>
        <div class="columns is-multiline">
            <div v-for="(preview, index) in this.boards" :key="index" class="column is-3">
                <div class="card">
                    <div class="card-content">
                        <div class="content">
                            <div @click="$router.push(`/user-boards/${preview.id}`)">
                                <h1 class="title has-text-black">{{preview.name}}</h1>
                                <h2 class="subtitle has-text-grey">{{preview.description}}</h2>
                            </div>
                            <button class="button is-warning" @click="handleUpdate(preview)">Изменить</button>
                            <button class="button is-danger" @click="handleDelete(preview.id)">Удалить</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal" :class="{ 'is-active': modal.isActive }">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">
                        {{ this.options.mode === 'create' ? 'Добавить' : 'Изменить' }} доску
                    </p>
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
                            Минимальное кол-во символов: {{ options.inputMinLength }}
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
                            Минимальное кол-во символов: {{ options.inputMinLength }}
                        </p>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button
                        class="button is-success"
                        :class="{ 'is-loading': this.modal.isLoading }"
                        :disabled="
                        $v.formData.name.$invalid === true ||
                        $v.formData.description.$invalid === true
                    "
                        @click="handleCardProcessing"
                    >
                        {{ this.options.mode === 'create' ? 'Добавить' : 'Изменить' }}
                    </button>
                    <button
                        class="button is-danger"
                        :class="{ 'is-hidden': this.modal.isLoading }"
                        @click="modal.isActive = false"
                    >
                        Отменить
                    </button>
                </footer>
            </div>
        </div>

    </div>
</template>

<script>

import {mapGetters} from "vuex";
import Board from '@/plugins/models/Board';
import { required, minLength } from 'vuelidate/lib/validators';
import { inputMethods, validationMixinAsset } from '@/libs/libStack';

export default {
    mixins: [validationMixinAsset],
    data() {
        return {
            options: {
                inputMinLength: 5,
                mode: 'create',
            },
            boards: [],
            modal: {
                isActive: false,
                isLoading: false,
            },
            formData: {
                id: null,
                name: null,
                description: null,
            },
        };
    },
    computed: {
        ...mapGetters('user', ['getUserId']),
    },
    methods: {
        ...inputMethods,
        handleCreate() {
            this.modal.isActive = true;
            this.options.mode = 'create';
        },
        handleUpdate(board) {
            this.formData = {...board};
            this.modal.isActive = true;
            this.options.mode = 'update';
        },
        handleDelete(id) {
            this.$axios
                .$delete(`/user/${this.getUserId}/boards/${id}`)
                .then((boards) => {

                    this.loadBoards();

                });
        },
        loadBoards() {
            this.$axios
                .$get(`/user/${this.getUserId}/boards`)
                .then((boards) => {
                    this.boards = [];
                    for (const board of boards) {
                        this.boards.push(new Board(board));
                    }

                });
        },
        flushFormData () {
            for (const item in this.formData) {
                this.formData[item] = null;
            }
        },
        onCardProcessingComplete() {
            this.modal.isLoading = false;
            this.modal.isActive = false;
            this.$v.$reset();
            this.flushFormData();
            this.loadBoards();
        },
        handleCardProcessing() {
            this.modal.isLoading = true;

            const actions = {
                create:() => {
                    this.$axios
                        .$post(`/user/${this.getUserId}/boards`, {
                            formData: this.formData,
                        })
                        .then(() => this.onCardProcessingComplete());
                },
                update:() => {
                    this.$axios
                        .$put(`/user/${this.getUserId}/boards/${this.formData.id}`, {
                            formData: this.formData,
                        })
                        .then(() => {
                            this.onCardProcessingComplete();
                        });
                },
            };

            if (this.options.mode in actions === false) {
                throw new Error('Режим обработки не установлен');
            }

            actions[this.options.mode]();
        },
    },
    validations () {
        return {
            formData: {
                name: {
                    required,
                    minLength: minLength(this.options.inputMinLength),
                },
                description: {
                    required,
                    minLength: minLength(this.options.inputMinLength),
                },
            },
        };
    },
    mounted() {
        this.loadBoards();
    },
}

</script>

<style scoped>
    .card:hover {
        cursor: pointer;
    }
</style>
