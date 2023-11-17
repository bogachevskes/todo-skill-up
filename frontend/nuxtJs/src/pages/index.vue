<template>
    <section class="hero is-info is-fullheight" style="min-height: 600px">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-vcentered">
                    <Invite />
                    <Register v-if="isLogged === false" />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex';
import Invite from '@/components/home/Invite';
import Register from '@/components/home/Register';

export default {
    name: 'IndexPage',
    components: {
        Invite,
        Register,
    },
    beforeRouteLeave (to, from, next) {
        this.$eventBus.hideInviteIntro();
        next();
    },
    computed: {
        ...mapGetters('todo', ['isLogged']),
    },
};
</script>
