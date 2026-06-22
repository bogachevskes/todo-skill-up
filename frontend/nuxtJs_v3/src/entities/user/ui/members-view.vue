<template>
  <div class="flex flex-col gap-2">
    <a-user-cell
      v-for="user in users"
      :key="user.id"
      :title="user.name || user.email"
      :description="user.email"
      :avatar="userImage"
    />
  </div>
</template>

<script lang="ts" setup>
import userImage from '~/assets/img/5.png';
import type { IUser } from '~/entities/user';

import AUserCell from './a-user-cell.vue';

defineProps<{
  users: IUser[];
}>();
</script>
