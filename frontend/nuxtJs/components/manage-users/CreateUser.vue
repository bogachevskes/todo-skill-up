<template>
    <div>
        <Form
            :actionHeading="'Добавление нового пользователя'"
            :actionText="'Создать'"
            :confirmAction="handleCreating"
        />
    </div>
</template>

<script>
    import Form from './Form';

    export default {
        methods: {
            handleCreating: function (formData) {
                
                this.$axios.$post(`admin/users/create`, { formData })
                    .then(result => {
                        const resultItem = result.item;

                        if (resultItem.success) {
                            
                            this.$router.push('/manage/users');
                            return;
                        }
                        
                        this.$eventBus.showError(
                                'Ошибка при создании пользователя',
                                resultItem.error
                            );
                    });
                    
            },
        },
        components: {
            Form,
        },
    }
</script>

<style>

</style>