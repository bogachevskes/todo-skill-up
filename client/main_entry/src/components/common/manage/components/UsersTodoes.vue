<template>
    <div>
        Начать отсюда
    </div>
</template>

<script>
    export default {
        methods: {
            loadUserTodoes: function (userId) {
                console.log(userId);
            },
        },
        beforeRouteEnter (to, from, next) {
              next(vm => {
                vm.loadUserTodoes(vm.$route.params.id);
            })
        },
    }
</script>

<style>

</style>