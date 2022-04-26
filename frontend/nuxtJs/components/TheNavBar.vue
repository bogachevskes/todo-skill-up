<template>
    <div>
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <span class="navbar-brand">
                <a class="navbar-item nav-left" href="/">
                    <img src="~/assets/bulma-logo.svg" width="40" height="28">
                    TODO LIST
                </a>
            </span>
            <div class="navbar-end">
                <TheInviteActions />
            </div>
        </nav>
    </div>
</template>

<script>
    import TheInviteActions from './TheInviteActions';

    export default {
        name: 'TheNavBar',
        components: {
            TheInviteActions,
        }
    }

</script>

<style scoped>

    @media screen and (min-width: 400px) {
        .navbar-end {
            justify-content: flex-end;
            margin-left: auto;
        }
    }

    @media screen and (min-width: 400px) {
        .navbar, .navbar-menu, .navbar-start, .navbar-end {
            align-items: stretch;
            display: flex;
        }
    }
    
</style>