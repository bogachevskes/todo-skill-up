<template>
    <div class="layout-root">
        <TheNotifications />
        <TheSuccessModal />
        <TheErrorModal />
        <div class="layout-header">
            <TheNavBar />
        </div>
        <div class="layout-main">
            <section class="columns is-fullheight">
                <TheActions />
                <Nuxt />
            </section>
        </div>
        <div class="layout-footer">
            <TheFooter />
        </div>
    </div>
</template>

<script>
import TheNotifications from '@/components/TheNotifications';
import TheNavBar from '@/components/TheNavBar';
import TheFooter from '@/components/TheFooter';
import TheSuccessModal from '@/components/modals/TheSuccessModal';
import TheErrorModal from '@/components/modals/TheErrorModal';
import TheActions from '@/components/TheActions';

export default {
    name: 'DefaultLayout',
    components: {
        TheNotifications,
        TheNavBar,
        TheFooter,
        TheSuccessModal,
        TheErrorModal,
        TheActions,
    },
};
</script>
