<template>
    <section class="hero is-info is-fullheight" style="min-height: 600px">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-vcentered">
                    <div
                        class="column is-6-tablet is-7-desktop is-8-widescreen"
                    >
                        <TheProjectTitle />
                    </div>
                    <Login v-if="isLogged === false" />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex';
import Login from '@/components/login/Login';
import TheProjectTitle from '@/components/TheProjectTitle';

export default {
    components: {
        TheProjectTitle,
        Login,
    },
    computed: {
        ...mapGetters('todo', ['isLogged']),
    },
};
</script>
