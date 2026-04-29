<template>
    <div class="column">
        <div class="section has-background-info">
            <div class="columns">
                <Form
                    :form-data="formData"
                    :action-heading="'Редактировать пользователя'"
                    :action-text="'Сохранить'"
                    :confirm-action="handleUpdating"
                    :emailDisabled="true"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Form from '@/components/users/Form';

export default {
    components: {
        Form,
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.setUserId(vm.$route.params.id);
            vm.loadUserData();
        });
    },
    layout: 'desk',
    data () {
        return {
            userId: null,
            formData: {
                id: null,
                name: null,
                email: null,
                password: null,
                confirm_password: null,
            },
        };
    },
    methods: {
        setUserId (userId) {
            this.userId = userId;
        },
        loadUserData () {
            this.$axios
                .$get(`/admin/users/${this.userId}`)
                .then((result) => {
                    this.formData = {
                        ...result,
                    };
                });
        },
        handleUpdating (data) {

            const formData = {...data};

            delete formData['email'];
            delete formData['confirm_password'];

            this.$axios
                .$patch(`/admin/users/${this.userId}`, { formData })
                .then(() => {
                    this.$router.push('/admin/users');
                });
        },
    },
};
</script>
