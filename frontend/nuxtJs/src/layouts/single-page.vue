<template>
    <div class="layout-root">
        <div class="layout-header">
            <TheNavBar :showInviteAction="false" />
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
import TheNotifications from '@/components/TheNotifications';
import TheSuccessModal from '@/components/modals/TheSuccessModal';
import TheErrorModal from '@/components/modals/TheErrorModal';

export default {
    name: 'DefaultLayout',
    components: {
        TheNavBar,
        TheFooter,
        TheSuccessModal,
        TheErrorModal,
        TheNotifications,
    },
};
</script>
