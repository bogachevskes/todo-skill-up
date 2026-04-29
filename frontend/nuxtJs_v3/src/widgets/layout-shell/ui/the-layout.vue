<template>
  <a-config-provider :theme="currentThemeConfig">
    <a-layout
      :page-title="props.title"
      :is-has-sider="props.isHasSider"
      class="ant-page-layout min-h-screen"
    >
      <the-header />

      <a-layout>
        <a-layout-sider
          v-if="props.isHasSider"
          v-model:collapsed="isCollapsedSidebar"
          :width="250"
          :collapsed-width="80"
          collapsible
          class="custom-sider"
          :style="{
            backgroundColor: token.colorPrimaryBg,
            borderRight: `1px solid ${token.colorBorderSecondary}`,
          }"
        >
          <div class="p-4 h-full">
            <slot name="siderMenu" />
          </div>
        </a-layout-sider>

        <a-layout-content
          class="ant-page-layout-view"
          :style="{ backgroundColor: token.colorBgLayout }"
        >
          <a-breadcrumb
            v-if="$slots.breadcrumbs"
            class="!w-full px-8 py-3 max-lg:py-1 max-lg:!px-5"
            :style="{
              backgroundColor: token.colorBgContainer,
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
            }"
          >
            <div class="flex flex-col gap-0">
              <div
                class="text-lg font-bold"
                :style="{ color: token.colorText }"
              >
                {{ props.title }}
              </div>

              <slot name="breadcrumbs" />
            </div>
          </a-breadcrumb>

          <div class="px-8 py-6 max-lg:px-5">
            <slot />
          </div>
        </a-layout-content>
      </a-layout>

      <a-layout-footer
        class="px-8 max-lg:!px-5 border-top"
        :style="{
          backgroundColor: token.colorBgContainer,
          borderColor: token.colorBorderSecondary,
        }"
      >
        <the-footer />
      </a-layout-footer>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { useToken } from 'ant-design-vue/es/theme/internal';
import { computed, provide, ref } from 'vue';

import {
  CURRENT_THEME_KEY,
  SET_THEME_KEY,
  THEME_LIST,
  type ThemeName,
} from '@/shared/theme';

import TheFooter from './the-footer.vue';
import TheHeader from './the-header.vue';

const props = withDefaults(
  defineProps<{
    title: string;
    isHasSider?: boolean;
  }>(),
  {
    isHasSider: false,
  },
);

const isCollapsedSidebar = ref(false);
const [, token] = useToken();

const currentThemeName = ref<ThemeName>('Морской бриз');

const currentTheme = computed(() => {
  return THEME_LIST[currentThemeName.value];
});

const currentThemeConfig = computed(() => {
  return {
    token: currentTheme.value.token,
  };
});

const setTheme = (name: ThemeName): void => {
  const selectedTheme = THEME_LIST[name];

  if (selectedTheme.token !== undefined) {
    currentThemeName.value = name;
    localStorage.setItem('theme', String(name));
  }
};

const savedTheme = localStorage.getItem('theme');
if (savedTheme !== null && savedTheme in THEME_LIST) {
  currentThemeName.value = savedTheme as ThemeName;
}

provide(SET_THEME_KEY, setTheme);
provide(CURRENT_THEME_KEY, currentThemeName);
</script>

<style>
.custom-sider {
  .ant-layout-sider-trigger {
    color: v-bind('token.colorText') !important;
    background-color: v-bind('token.colorBgContainer') !important;
    border-top: 1px solid v-bind('token.colorBorderSecondary') !important;
    position: relative;
    border-bottom: 1px solid v-bind('token.colorBorderSecondary') !important;

    &:hover {
      background-color: v-bind('token.colorBgTextHover') !important;
    }
  }

  .ant-layout-sider-children {
    background-color: v-bind('token.colorBgContainer');
  }
}
</style>
