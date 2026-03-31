<template>
  <a-card
    class="w-full shadow-md border hover:shadow-lg transition-all duration-300"
    :style="{ borderColor: token.colorBorderSecondary, '--main-bg-color': token.mainBgColor }"
  >
    <template #title>
      <div class="flex items-center justify-between gap-2">
        <div className="text-lg font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
          {{ title }}
        </div>

        <div class="flex items-center gap-1">
          <a-tooltip
            title="Редактировать задачу"
            placement="top"
          >
            <a-button
              size="small"
              :icon="h(EditOutlined)"
              @click="emit('on-edit')"
            />
          </a-tooltip>
          <a-popconfirm
            title="Вы уверены что хотите удалить задачу?"
            ok-text="Да"
            cancel-text="Нет"
            @confirm="emit('on-delete')"
          >
            <a-button
              size="small"
              danger
              :icon="h(DeleteOutlined)"
            />
          </a-popconfirm>
        </div>
      </div>
    </template>

    <p className="text-sm mb-2">
      {{ description }}
    </p>
    <div>
      <a-typography-text
        type="secondary"
        class="text-xs"
      >
        Создано: {{ createdAt }}
      </a-typography-text>
    </div>
    <div class="mt-[-5px]">
      <a-typography-text
        type="secondary"
        class="text-xs"
      >
        Дата выполнения: {{ dueDate }}
      </a-typography-text>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue';
import { useToken } from 'ant-design-vue/es/theme/internal';

const [, token] = useToken();

defineProps<{
  title: string;
  description: string;
  createdAt: string;
  dueDate: string;
}>();

const emit = defineEmits<{
  (event: 'on-edit'): void;
  (event: 'on-delete'): void;
}>();

</script>

<style scoped lang="scss" src="./task-item.scss" />