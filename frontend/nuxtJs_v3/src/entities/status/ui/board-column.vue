<template>
  <div
    class="board-column bg-base-layout"
    :class="{
      'board-column_folded': isFolded,
      'board-column_open': isFolded === false,
    }"
    :style="{ backgroundColor: bgColor }"
  >
    <div
      class="header"
      :class="{
        header_folded: isFolded,
        header_open: isFolded === false,
      }"
    >
      <div
        :class="{ folded: isFolded, open: isFolded === false }"
        class="header__toggler"
        @click="toggleFolded"
      >
        <up-outlined v-if="isCanToggleFolded === true" />
      </div>
      <div
        class="header__title whitespace-nowrap text-ellipsis overflow-hidden font-semibold"
        :class="{ header__title_folded: isFolded }"
      >
        {{ title }}
      </div>
      <div v-if="isFolded === false">
        <slot name="title-button" />
      </div>
    </div>
    <div
      v-if="isLoading === true"
      class="is-loading"
    >
      <a-spin size="large" />
    </div>
    <div
      v-if="isLoading === false"
      class="body"
      :class="{ body_folded: isFolded }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { UpOutlined } from '@ant-design/icons-vue';
import { onMounted, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    title: string;
    isDefaultFolded?: boolean;
    isCanToggleFolded?: boolean;
    isLoading?: boolean;
    bgColor?: string;
  }>(),
  {
    isDefaultFolded: false,
    isCanToggleFolded: true,
    isLoading: false,
    bgColor: '#f5f5f5',
  }
);

const isFolded = ref(false);

function toggleFolded(): void {
  if (props.isCanToggleFolded === false) {
    return;
  }
  isFolded.value = !isFolded.value;
}

onMounted(() => {
  if (props.isDefaultFolded === true) {
    isFolded.value = true;
  }
});
</script>

<style lang="scss" scoped src="./board-column.scss" />
