<template>
    <section class="main-content columns is-fullheight is-info">
        <actions-item></actions-item>
        <div class="container column">
            <div class="section has-background-info" style="padding: 20px;">
                <router-view></router-view>
            </div>
        </div>
    </section>
</template>

<script>

    import Actions from '@common-components/Actions';

    export default {
        components: {
            'actions-item': Actions,
        },
    }

</script>

<style>

</style>