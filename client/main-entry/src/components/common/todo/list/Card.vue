<template>
    
    <div class="column is-3">
        <div class="card">
        <div class="card-content">
            <p class="title" style="color:black">
                {{card.name}}
            </p>
            <p class="subtitle" style="color:black">
                <u>Описание:</u><br>
                {{ card.prinDescription() }}
            </p>
            <div class="content">
                Плановая дата выполнения:<br>{{ card.printPlannedCompilationAt() }}
                <br>
                Создано:<br>{{ card.printCreatedAt() }}
            </div>
        </div>
        <footer class="card-footer">
            <p class="card-footer-item">
                <span class="button is-warning">
                    Изменить
                </span>
            </p>
            <p class="card-footer-item">
                <span class="button is-danger">
                    Удалить
                </span>
            </p>
        </footer>
        </div>
    </div>

</template>

<script>

    export default {
        props: ['card']
    }

</script>

<style>

</style>