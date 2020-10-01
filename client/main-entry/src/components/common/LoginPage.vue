<template>
    <section class="hero is-info is-fullheight" style="min-height:600px;">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-vcentered">
                    <div class="column is-6-tablet is-7-desktop is-8-widescreen">
                        <app-project-title></app-project-title>
                    </div>
                    <app-login></app-login>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import Login from '@login-page-components/Login';
    import ProjectTitle from '@common-components/ProjectTitle';
    
    export default {
        components: {
            'app-project-title': ProjectTitle,
            'app-login': Login,
        },
    }
</script>