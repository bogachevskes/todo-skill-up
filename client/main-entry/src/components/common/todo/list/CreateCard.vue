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
                            <input class="input" type="text" placeholder="Сделать невозможное...">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Дата выполнения</label>
                        <div class="control">
                            <input type="date" id="planned_complition_at">
                        </div>
                    </div>
                    <div class="columns">
                        <div class="column is-12">
                            <div class="field">
                                <label class="label">Описание задачи</label>
                                <div class="control">
                                    <textarea class="textarea" placeholder="В этой потрясающей задаче я сделаю..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success">Сохранить</button>
                    <button class="button is-danger" @click="deactivateModal()">Отменить</button>
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

    import * as bulmaCalendar from 'bulma-calendar/dist/js/bulma-calendar.min.js';

    export default {
        data: function () {
            return {
                isModalActive: 0,
                modalHeadingText: null,
            };
        },
        methods: {
            activateModal: function (modalHeadingText) {
                this.modalHeadingText = modalHeadingText;
                this.isModalActive = 1;
            },
            deactivateModal: function () {
                this.modalHeadingText = null;
                this.isModalActive = 0;
            },
        },
        mounted: function () {
            bulmaCalendar.attach(
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
            )
        },
    }
</script>

<style lang="scss">

.menu-list li a:hover {
    background: #09bd5a;
}

</style>