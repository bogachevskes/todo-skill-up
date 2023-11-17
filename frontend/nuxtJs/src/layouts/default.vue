<template>
    <div class="layout-root">
        <TheSuccessModal />
        <TheErrorModal />
        <div class="layout-header">
            <TheNavBar />
        </div>
        <div class="layout-main">
            <Nuxt />
        </div>
        <div class="layout-footer">
            <TheFooter />
        </div>
    </div>
</template>

<script>
import TheNavBar from '@/components/TheNavBar';
import TheFooter from '@/components/TheFooter';
import TheSuccessModal from '@/components/modals/TheSuccessModal';
import TheErrorModal from '@/components/modals/TheErrorModal';

export default {
    name: 'DefaultLayout',
    components: {
        TheNavBar,
        TheFooter,
        TheSuccessModal,
        TheErrorModal,
    },
};
</script>
