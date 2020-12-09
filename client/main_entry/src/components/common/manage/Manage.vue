<template>
    <section class="hero is-info is-fullheight" style="min-height:600px;">
        <div class="hero-body">
            <div class="container">
                <actions-item></actions-item>
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