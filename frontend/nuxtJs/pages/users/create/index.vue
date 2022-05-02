<template>
    <div class="column">
        <div class="section has-background-info">
            <div class="columns">
                <Form
                    :actionHeading="'Добавление нового пользователя'"
                    :actionText="'Создать'"
                    :confirmAction="handleCreating"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import Form from '@/components/users/Form';

    export default {
        layout: 'desk',
        methods: {
            handleCreating: function (formData) {
                
                this.$axios.$post(`admin/users/create`, { formData })
                    .then(result => {
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
        components: {
            Form,
        },
    }
</script>