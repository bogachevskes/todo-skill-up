<template>
    <app-main-layout></app-main-layout>
</template>

<script>
    import MainLayout from './components/MainLayout';

    export default {
        components: {
            'app-main-layout': MainLayout,
        },
    }
</script>

<style lang="scss">

    @import '~bulma/bulma.sass';
    @import '~bulma-calendar/src/sass/index.sass';

    .mt-1 {
        margin-top:10px;
    };

</style>
