<template>
  <a-layout-header
    class="!px-8 max-lg:!px-5"
    :style="{
      backgroundColor: token.colorPrimaryBg,
      height: '50px',
    }"
  >
    <div class="mx-auto h-full flex items-center justify-between">
      <div class="flex items-end gap-3">
        <router-link
          :to="`${config.public.basePath}`"
          class="flex items-center gap-2"
        >
          <the-logo
            class="h-5 max-lg:h-3 w-auto"
            :style="{ color: token.colorText }"
          />
        </router-link>

        <div class="default-logo-text flex items-center gap-3">
          <span
            class="text-base text-sm"
            :style="{ color: token.colorTextLabel }"
          >/</span>
          <span
            class="text-base text-sm"
            :style="{ color: token.colorTextLabel }"
          >
            {{ logoText }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <the-profile />
      </div>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { useToken } from 'ant-design-vue/es/theme/internal';

import { useRuntimeConfig } from '#imports';

import TheLogo from './the-logo.vue';
import TheProfile from './the-profile.vue';

const config = useRuntimeConfig();

withDefaults(
  defineProps<{
    logoText?: string;
  }>(),
  {
    logoText: 'Todo List',
  },
);

const [, token] = useToken();
</script>

<style scoped lang="scss" src="./style.scss" />
