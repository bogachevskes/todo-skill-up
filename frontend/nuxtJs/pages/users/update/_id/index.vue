<template>
    <div class="column">
        <div class="section has-background-info">
            <div class="columns">
                <Form
                    :formData="formData"
                    :actionHeading="'Редактировать пользователя'"
                    :actionText="'Сохранить'"
                    :confirmAction="handleUpdating"
                    :passwordStrictRequired="false"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import Form from '@/components/users/Form';

    export default {
        layout: 'desk',
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
                            ...result.item
                        };
                    });
            },
            handleUpdating: function (formData) {
                this.$axios.$put(`admin/users/update/${this.userId}`, { formData })
                    .then(result => {

                        const resultItem = result.item;
                        
                        if (resultItem.success) {
                            
                            this.$router.push('/users');
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