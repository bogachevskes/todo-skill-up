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
    layout: 'desk',
    methods: {
        handleCreating (formData) {
            this.$axios
                .$post(`admin/users/create`, { formData })
                .then((result) => {
                    const resultItem = result.item;

                    if (resultItem.success) {
                        this.$router.push('/users');
                        return;
                    }

                    this.$eventBus.showError(
                        'Ошибка при создании пользователя',
                        resultItem.error
                    );
                });
        },
    },
};
</script>
