<template>
    <div>
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <span class="navbar-brand">
                <a class="navbar-item nav-left" href="/">
                    <img src="/img/bulma-logo.svg" width="40" height="28">
                    TODO LIST
                </a>
            </span>
            <div class="navbar-end">
                <router-view name="invite-actions"></router-view>
            </div>
        </nav>
    </div>
</template>

<script>
    export default {
        
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