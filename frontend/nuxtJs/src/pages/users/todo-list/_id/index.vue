<template>
    <div class="column is-10">
        <div class="section has-background-info" style="padding: 20px">
            <div class="columns">
                <Group
                    v-for="(group, index) in groups"
                    :key="index"
                    :group="group"
                />
            </div>
        </div>
    </div>
</template>

<script>
import TodoGroupsService from '@/plugins/services/TodoGroupsService';

import Group from '@/components/todo-list/Group';

export default {
    components: {
        Group,
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.loadUserTodo(vm.$route.params.id);
        });
    },
    layout: 'desk',
    data () {
        return {
            groups: [],
        };
    },
    methods: {
        loadUserTodo (userId) {
            this.$axios
                .$get(`/admin/users/todo/${userId}`)
                .then((result) => {
                this.groups = TodoGroupsService.createGroups(result.items);
            });
        },
    },
};
</script>

<style></style>
