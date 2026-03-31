<template>
  <a-empty>
    <template #image>
      <div class="w-[100px] empty-status-icon">
        <project-outlined
          :rotate="180"
          :style="{ color: token.colorBorder }"
        />
      </div>
    </template>
    <template #description>
      На данной доске не добавлено ни одного статуса
    </template>
    <a-button
      v-if="isManage"
      type="primary"
      @click="emit('on-add-status')"
    >
      Добавить
      статус
    </a-button>
  </a-empty>
</template>

<script setup lang="ts">
import { ProjectOutlined } from '@ant-design/icons-vue';
import { useToken } from 'ant-design-vue/es/theme/internal';
const [, token] = useToken();

defineProps<{
  isManage: boolean;
}>();

const emit = defineEmits<{
  (event: 'on-add-status'): void;
}>();
</script>

<style src="./empty-status.scss" />