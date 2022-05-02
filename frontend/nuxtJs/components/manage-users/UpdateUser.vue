<template>
    <div>
        <Form
            :formData="formData"
            :actionHeading="'Редактировать пользователя'"
            :actionText="'Сохранить'"
            :confirmAction="handleUpdating"
            :passwordStrictRequired="false"
        />
    </div>
</template>

<script>
    import Form from './Form';

    export default {
        data: function () {
            return {
                userId: null,
                formData: {
                    id: null,
                    name: null,
                    email: null,
                    hasPassword: null,
                    password: null,
                    confirm_password: null,
                },
            };
        },
        methods: {
            setUserId: function (userId) {
                this.userId = userId;
            },
            loadUserData: function () {
                this.$axios.$get(`admin/users/get-user-data/${this.userId}`)
                    .then(result => {
                        this.formData = {
                            ...this.formData,
                            ...result.data.item
                        };
                    });
            },
            handleUpdating: function (formData) {
                this.$axios.$put(`admin/users/update/${this.userId}`, { formData })
                    .then(result => {

                        const resultItem = result.data.item;
                        
                        if (resultItem.success) {
                            
                            this.$router.push('/manage/users');
                            return;
                        }

                        this.$eventBus.showError(
                                'Ошибка при сохранении',
                                resultItem.error
                            );

                    });
            },
        },
        components: {
            Form,
        },
        beforeRouteEnter (to, from, next) {
              next(vm => {
                vm.setUserId(vm.$route.params.id);
                vm.loadUserData();
            })
        },
    }
</script>

<style>

</style>