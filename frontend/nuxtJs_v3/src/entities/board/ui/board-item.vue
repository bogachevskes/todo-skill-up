<template>
  <a-card
    class="boards-card flex flex-col"
    hoverable
    @click="router.push(`${config.public.basePath}boards/${item.id}`)"
  >
    <template #title>
      <div class="flex gap-2 items-center justify-between">
        <div class="font-bold text-base custom-text-ellipsis">
          {{ item.name }}
        </div>

        <a-flex
          gap="small"
          justify="center"
        >
          <a-tooltip
            v-if="isManageBoard"
            title="Редактировать"
            placement="top"
          >
            <a-button
              :icon="h(EditOutlined)"
              @click="onEdit($event, item.id)"
            />
          </a-tooltip>
          <a-tooltip
            v-if="isDeleteBoard"
            title="Удалить"
            placement="top"
          >
            <a-button
              danger
              :icon="h(DeleteOutlined)"
              @click="onDelete($event, item.id)"
            />
          </a-tooltip>
        </a-flex>
      </div>
    </template>

    <div class="flex flex-col gap-4 h-full">
      <div>{{ item.description }}</div>

      <div class="flex flex-col mt-auto">
        <div class="flex gap-2">
          <user-outlined
            :style="{ color: token.colorPrimary }"
            class="is-active-icon"
          />
          <span>{{ item.owner?.email }}</span>
        </div>
        <div class="flex gap-2">
          <calendar-outlined
            :style="{ color: token.colorPrimary }"
            class="is-active-icon"
          />
          <span>{{ dayjs(item.createdAt).format('DD.MM.YYYY HH:mm:ss') }}</span>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { EditOutlined, DeleteOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons-vue';
import { useToken } from 'ant-design-vue/es/theme/internal';
import dayjs from 'dayjs';

import type { IBoard } from '~/entities/board';

import { useRouter, useRuntimeConfig } from '#imports';

const config = useRuntimeConfig();
const [, token] = useToken();
const router = useRouter();

defineProps<{
  item: IBoard;
  isManageBoard: boolean;
  isDeleteBoard: boolean;
}>();

const emit = defineEmits<{
  (event: 'on-delete', payload: number): void;
  (event: 'on-edit', payload: number): void;
}>();

const onEdit = (e: Event, id: number): void => {
  e.stopPropagation();
  emit('on-edit', id);
};

const onDelete = (e: Event, id: number): void => {
  e.stopPropagation();
  emit('on-delete', id);
};
</script>

<style src="./board-item.scss" />
