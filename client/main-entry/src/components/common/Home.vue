<template>
    <section class="hero is-info is-fullheight" style="min-height:600px;">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-vcentered">
                    <app-invite></app-invite>
                    <app-register></app-register>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import Invite from '@common-components/Invite';
    import Register from '@login-page-components/Register';
    import {eventBus} from '@store/eventBus';
    
    export default {
        components: {
            'app-invite': Invite,
            'app-register': Register,
        },
        beforeRouteLeave: function (to, from, next) {
            eventBus.hideInviteIntro();
            next();
        },
    }
</script>