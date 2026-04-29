<template>
    <section class="hero is-info is-fullheight" style="min-height: 600px">
        <div class="hero-body">
            <div v-if="isLogged === false" class="container">
                <div class="columns is-vcentered">
                    <div
                        class="column is-6-tablet is-7-desktop is-8-widescreen"
                    >
                        <TheProjectTitle />
                    </div>
                    <Login v-if="onRegistration === false" />
                    <Register v-if="onRegistration === true" />
                </div>
            </div>
            <Boards v-if="isLogged === true" />
        </div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex';
import TheProjectTitle from '@/components/TheProjectTitle';
import Register from '@/components/home/Register';
import Login from '@/components/home/Login';
import Boards from '@/components/user-boards/Boards';

export default {
    name: 'IndexPage',
    components: {
        TheProjectTitle,
        Login,
        Register,
        Boards,
    },
    computed: {
        ...mapGetters('user', ['isLogged']),
        ...mapGetters('invite', ['onRegistration']),
    },
};
</script>
