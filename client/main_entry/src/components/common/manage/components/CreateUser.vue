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

    import axios from '@axios/base';

    export default {
        methods: {
            handleCreating: function () {
                axios.post(`admin/users/create`)
                    .then(result => {
                        this.$router.push('/manage/users');
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