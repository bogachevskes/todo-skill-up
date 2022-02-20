<template>
    <div>
        <form-item
            :actionHeading="'Добавление нового пользователя'"
            :actionText="'Создать'"
            :confirmAction="handleCreating"
        >
        </form-item>
    </div>
</template>

<script>
    import form from './common/_form';

    import { eventBus } from '@store/eventBus';

    import axios from '@axios/base';

    export default {
        methods: {
            handleCreating: function (formData) {
                
                axios.post(`admin/users/create`, { formData })
                    .then(result => {
                        const resultItem = result.data.item;

                        if (resultItem.success) {
                            
                            this.$router.push('/manage/users');
                            return;
                        }
                        
                        eventBus.showError(
                                'Ошибка при создании пользователя',
                                resultItem.error
                            );
                    });
                    
            },
        },
        components: {
            'form-item': form,
        },
    }
</script>

<style>

</style>