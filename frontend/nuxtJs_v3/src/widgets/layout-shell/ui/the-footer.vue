<template>
  <div class="flex gap-4 max-lg:gap-2 flex-wrap max-lg:flex-col text-left w-full">
    <div class="footer-column mobile-w-full">
      <strong class="block">TODO LIST</strong>
      <div>
        Версия
        <a
          target="_blank"
          href="https://github.com/bogachevskes/todo-skill-up/releases"
        >{{ config.public.appVersion }}</a>
      </div>
    </div>

    <div class="footer-column mobile-w-full">
      <a
        class="block"
        href="https://github.com/bogachevskes"
        target="_blank"
      >
        Разработчик Андрей Богачевский
      </a>
      <a
        class="block"
        href="http://opensource.org/licenses/mit-license.php"
        target="_blank"
      >Лицензия MIT</a>
    </div>

    <div class="footer-column mobile-w-full">
      <a
        class="block"
        target="_blank"
        href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
      >
        Контент сайта лицензирован CC BY NC SA 4.0
      </a>
      <a
        class="block"
        target="_blank"
        href="/terms"
      >Условия пользования сервисом</a>
    </div>

    <div class="footer-column mobile-w-full">
      <a
        class="block"
        target="_blank"
        href="/swagger-ui"
      >Документация API</a>
    </div>

    <a-dropdown
      placement="topRight"
      class="fixed bottom-4 right-4"
    >
      <a-button
        class="p-2 !py-5 items-center flex border-0 right-0"
        :style="{
          backgroundColor: token.colorPrimary,
        }"
      >
        <setting-outlined
          class="text-2xl"
          :style="{ color: '#ffffff' }"
        />
      </a-button>

      <template #overlay>
        <a-menu>
          <a-menu-item
            v-for="(theme, name) in themes"
            :key="name"
            @click="changeTheme(name)"
          >
            {{ name }}
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
import { SettingOutlined } from '@ant-design/icons-vue';
import { useToken } from 'ant-design-vue/es/theme/internal';
import { inject } from 'vue';

import {
  SET_THEME_KEY,
  THEME_LIST,
  type ThemeName,
} from '@/shared/theme';
import { useRuntimeConfig } from '#imports';

const setTheme = inject(SET_THEME_KEY);
const themes = THEME_LIST;

const [, token] = useToken();
const config = useRuntimeConfig();

const changeTheme = (name: ThemeName): void => {
  if (setTheme === undefined) {
    return;
  }

  setTheme(name);
};
</script>

<style scoped src="./footer.scss" />
