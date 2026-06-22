<template>
  <a-button
    v-if="userHasBoardPermission('manage-board-users')"
    class="user-action-btn"
    :icon="h(ShareAltOutlined)"
    @click="isOpenedManage = true"
  >
    Поделиться
  </a-button>
  <a-button
    v-if="userHasBoardPermission('manage-board-users') === false"
    class="user-action-btn"
    :icon="h(TeamOutlined)"
    @click="isOpenedView = true"
  >
    Участники
  </a-button>

  <!-- Управление пользователоями -->
  <a-drawer
    v-model:open="isOpenedManage"
    title="Добавить участников"
    placement="right"
    :closable="true"
    @close="isOpenedManage = false"
  >
    <members-manage
      :users="users || []"
      @on-refresh="refresh"
    />
  </a-drawer>

  <!-- Просмотр пользователей -->
  <a-drawer
    v-model:open="isOpenedView"
    title=" Участники"
    placement="right"
    :closable="true"
    @close="isOpenedView = false"
  >
    <members-view :users="users || []" />
  </a-drawer>
</template>

<script setup lang="ts">
import { ShareAltOutlined, TeamOutlined } from '@ant-design/icons-vue';

import { MembersView, type IUser } from '~/entities/user';
import { MembersManage } from '~/features/members-control';
import checkErrorStatus from '~/shared/feedback';
import { useApi } from '~/shared/network';

import { useAsyncData, useCookie } from '#imports';

const userId = useCookie('userId');

const props = defineProps<{
  boardId: number;
  userBoardPermissions: string[];
}>();

const { data, status, refresh } = await useAsyncData<IUser[]>(
  `boards/${props.boardId}/users`,
  () => useApi(`boards/${props.boardId}/users`, { method: 'GET' }) as Promise<IUser[]>
);

const users = computed(() => {
  return data.value?.filter(v => v.id !== Number(userId.value));
});

checkErrorStatus(status.value, 'Ошибка получения данных');

const isOpenedManage = ref(false);
const isOpenedView = ref(false);

const userHasBoardPermission = (permission: string): boolean => {
  return props.userBoardPermissions.includes(permission);
};
</script>
