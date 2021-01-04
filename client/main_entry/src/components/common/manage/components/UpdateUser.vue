<template>
    <div>
        <form-item
            :formData="formData"
            :actionHeading="'Редактировать пользователя'"
            :actionText="'Сохранить'"
            :confirmAction="handleUpdating"
            :passwordStrictRequired="false"
        >
        </form-item>
    </div>
</template>

<script>
    import form from './common/_form';

    import axios from '@axios/base';

    export default {
        data: function () {
            return {
                userId: null,
                formData: {
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
                axios.get(`admin/users/get-user-data/${this.userId}`)
                    .then(result => {
                        this.formData = {
                            ...this.formData,
                            ...result.data.item
                        };
                    });
            },
            handleUpdating: function () {
                axios.put(`admin/users/update/${this.userId}`)
                    .then(result => {
                        this.$router.push('/manage/users');
                    });
            },
        },
        components: {
            'form-item': form,
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