<template>
    <div class="container">
        <div class="columns">
            <group-item
                v-for="(group, index) in groups"
                :key="index"
                :group="group"
            ></group-item>
        </div>
    </div>
</template>

<script>
    
    import axios from '@axios/base';
    import TodoGroupsService from '@services/TodoGroupsService';

    import Group from '@common-components/todo/list/Group';
    
    export default {
        data: function () {
            return {
                groups: [],
            };
        },
        methods: {
            loadUserTodoes: function (userId) {
                axios.get(`admin/users/todoes/${userId}`)
                    .then(result => {
                        this.groups = TodoGroupsService.createGroups(result.data.items);
                    });
            },
        },
        components: {
            'group-item': Group,
        },
        beforeRouteEnter (to, from, next) {
              next(vm => {
                vm.loadUserTodoes(vm.$route.params.id);
            })
        },
    }
</script>

<style>

</style>