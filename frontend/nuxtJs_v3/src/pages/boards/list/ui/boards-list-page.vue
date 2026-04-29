<template>
  <the-layout title="Доски">
    <template #breadcrumbs>
      <a-breadcrumb class="font-normal">
        <a-breadcrumb-item>
          <RouterLink :to="`${config.public.basePath}`">
            Главная
          </RouterLink>
        </a-breadcrumb-item>
        <a-breadcrumb-item>Доски</a-breadcrumb-item>
      </a-breadcrumb>
    </template>

    <a-flex vertical>
      <div class="flex justify-end mb-4">
        <a-button
          type="primary"
          :icon="h(PlusOutlined)"
          @click="onAdd"
        >
          Добавить
        </a-button>
      </div>

      <div class="flex gap-4 flex-wrap">
        <board-item
          v-for="item in boardList"
          :key="item.id"
          :item="item"
          :is-manage-board="userHasBoardPermission(item.id, 'manage-board')"
          :is-delete-board="userHasBoardPermission(item.id, 'delete-board')"
          @on-edit="onEdit"
          @on-delete="onShowConfirm"
        />
      </div>

      <a-modal
        v-model:open="isShowModalDelete"
        title="Удаление доски"
      >
        <p>Вы уверены, что хотите удалить доску?</p>
        <template #footer>
          <div class="text-right">
            <a-button @click="onCancelDelete">
              Отменить
            </a-button>
            <a-button
              type="primary"
              :loading="isLoadDelete"
              @click="onDelete"
            >
              Да
            </a-button>
          </div>
        </template>
      </a-modal>

      <board-form
        :is-show-modal="isShowModalForm"
        :board="selectedBoard"
        @on-cancel="onCancelEdit"
        @on-save="onSaveItem"
      />
    </a-flex>
  </the-layout>
</template>

<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import cloneDeep from 'lodash/cloneDeep';

import { BoardItem, type IBoard } from '@/entities/board';
import { BoardForm } from '@/features/board-editor';
import { checkErrorStatus } from '@/shared/feedback';
import { useApi } from '@/shared/network';
import { TheLayout } from '@/widgets/layout-shell';

import { definePageMeta, useAsyncData, useCookie, useRuntimeConfig } from '#imports';

definePageMeta({
  middleware: 'auth',
});

const config = useRuntimeConfig();
const userId = useCookie('userId');
const isLoadDelete = ref(false);
const isShowModalDelete = ref(false);
const boardsUserPermissions = ref<Record<number, string[]>>({});
const isShowModalForm = ref(false);
const selectedBoard = ref<IBoard | null>(null);

const { data, status, refresh } = await useAsyncData<IBoard[]>(
  `/user/${userId.value}/boards`,
  () => useApi<IBoard[]>(`/user/${userId.value}/boards`, { method: 'GET' }),
);

const boardList = ref<IBoard[]>(data.value || []);

checkErrorStatus(status.value, 'Ошибка получения данных');

const loadPermissions = async (): Promise<void> => {
  const preparedPermissions: Record<number, string[]> = {};
  for (let i = 0; i < boardList.value.length; i++) {
    const board: IBoard = boardList.value[i];
    const res = await useAsyncData<string[]>(
      `/boards/${board.id}/users/${userId.value}/permissions`,
      () => useApi(`/boards/${board.id}/users/${userId.value}/permissions`, { method: 'GET' }) as Promise<string[]>
    );
    if (Boolean(res.data) === false) {
      continue;
    }
    preparedPermissions[board.id] = cloneDeep(res.data.value) || [];
  }
  boardsUserPermissions.value = preparedPermissions;
};

if (boardList.value && boardList.value?.length > 0) {
  loadPermissions();
}

watch(() => data.value, newVal => {
  boardList.value = newVal || [];
  loadPermissions();
});

watch(
  () => status.value,
  (newValue): void => {
    checkErrorStatus(newValue, 'Ошибка получения данных');
  },
);

watch(
  () => data.value,
  (newValue): void => {
    boardList.value = newValue || [];
  },
);

const userHasBoardPermission = (boardId: number, permission: string): boolean => {
  if (Object.hasOwn(boardsUserPermissions.value, boardId) === false) {
    return false;
  }

  return boardsUserPermissions.value[boardId].includes(permission);
};

const onShowConfirm = (id: number): void => {
  selectedBoard.value = boardList.value.find((item) => item.id === id) || null;
  isShowModalDelete.value = true;
};

const onCancelDelete = (): void => {
  selectedBoard.value = null;
  isShowModalDelete.value = false;
};

const onDelete = async (): Promise<void> => {
  isLoadDelete.value = true;
  try {
    await useApi(`user/${userId.value}/boards/${selectedBoard.value?.id}`, { method: 'DELETE' });
    const index = boardList.value?.findIndex(v => v.id === selectedBoard.value?.id);
    if (index !== undefined && index > -1) {
      const copy = cloneDeep(boardList.value);
      copy?.splice(index, 1);
      boardList.value = copy;
      selectedBoard.value = null;
      isShowModalDelete.value = false;
      message.success('Доска удалена');
    }
  } catch (e) {
    message.error(e as string);
  }
  isLoadDelete.value = false;
};

const onAdd = (): void => {
  isShowModalForm.value = true;
  selectedBoard.value = null;
};

const onEdit = (id: number): void => {
  isShowModalForm.value = true;
  selectedBoard.value = boardList.value.find((item) => item.id === id) || null;
};

const onCancelEdit = (): void => {
  isShowModalForm.value = false;
  selectedBoard.value = null;
};

const onSaveItem = (): void => {
  refresh();
  onCancelEdit();
};
</script>

<style scoped lang="scss" src="~/pages/boards/model/style.scss" />
