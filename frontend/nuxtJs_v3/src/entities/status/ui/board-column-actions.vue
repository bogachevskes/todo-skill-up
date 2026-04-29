<template>
  <div class="flex items-center gap-1">
    <a-tooltip
      title="Добавить задачу"
      placement="top"
    >
      <a-button
        size="small"
        :icon="h(PlusOutlined)"
        @click="emit('on-add-task', status.id)"
      />
    </a-tooltip>
    <a-tooltip
      v-if="isManage"
      title="Редактировать статус"
      placement="top"
    >
      <a-button
        size="small"
        :icon="h(EditOutlined)"
        @click="emit('on-edit-status', status)"
      />
    </a-tooltip>
    <a-popconfirm
      v-if="isDelete"
      title="Вы уверены что хотите удалить статус?"
      ok-text="Да"
      cancel-text="Нет"
      @confirm="emit('on-delete-status', status.id)"
    >
      <a-button
        size="small"
        danger
        :icon="h(DeleteOutlined)"
      />
    </a-popconfirm>
  </div>
</template>

<script setup lang="ts">
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons-vue';

import type { IStatus } from '~/entities/status';

defineProps<{
  isManage: boolean;
  isDelete: boolean;
  status: IStatus;
}>();

const emit = defineEmits<{
  (event: 'on-add-task', payload: number): void;
  (event: 'on-edit-status', payload: IStatus): void;
  (event: 'on-delete-status', payload: number): void;
}>();
</script>