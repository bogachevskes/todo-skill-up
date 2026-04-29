<template>
  <div class="pl-4 pr-4 flex flex-col transition-all board-info gap-4 w-[250px] overflow-hidden">
    <div class="mobile-w-full">
      <Text
        type="secondary"
        class="block row-label text-base"
      >
        Владелец:
      </Text>
      <Text class="block row-label text-base">
        {{ board?.owner?.name }}
      </Text>
    </div>
    <div class="mobile-w-full">
      <Text
        type="secondary"
        class="block row-label text-base"
      >
        Дата создания:
      </Text>
      <Text class="block row-label text-base">
        {{ dayjs(board?.createdAt).format('DD.MM.YYYY HH:mm') }}
      </Text>
    </div>
    <div class="mobile-w-full">
      <Text
        type="secondary"
        class="block row-label text-base"
      >
        Описание:
      </Text>
      <Text class="block row-label text-base">
        {{ board?.description }}
      </Text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Typography } from 'ant-design-vue';
import dayjs from 'dayjs';

import type { IBoard } from '~/entities/board';

const { Text } = Typography;

defineProps<{
  board: IBoard | null;
}>();
</script>

<style scoped lang="scss" src="./board-info.scss" />