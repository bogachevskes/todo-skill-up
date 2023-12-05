<template>
    <div class="column">
        <div class="section has-background-info">
            <div class="columns">
                <Form
                    :action-heading="'Добавление нового пользователя'"
                    :action-text="'Создать'"
                    :confirm-action="handleCreating"
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
    methods: {
        handleCreating (formData) {
            this.$axios
                .$post(`/admin/users`, { formData })
                .then(() => {
                    this.$router.push('/admin/users');
                });
        },
    },
};
</script>
