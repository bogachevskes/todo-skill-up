<template>
    <div class="layout-root">
        <app-success-modal></app-success-modal>
        <app-error-modal></app-error-modal>
        <div class="layout-header">
            <div class="container">
                <app-navbar></app-navbar>
            </div>
        </div>
        <div class="layout-main">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
        <div class="layout-footer">
            <app-footer></app-footer>
        </div>
    </div>
</template>

<script>
    import Navbar from './common/Navbar';
    import LoginPage from './common/LoginPage';
    import Footer from './common/Footer';
    import ErrorModal from '@common-components/modals/Error';
    import SuccessModal from '@common-components/modals/Success';
    
    export default {
        components: {
            'app-navbar': Navbar,
            'app-login-page': LoginPage,
            'app-footer': Footer,
            'app-success-modal': SuccessModal,
            'app-error-modal': ErrorModal,
        },
    }
</script>