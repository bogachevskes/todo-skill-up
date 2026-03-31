<template>
  <the-layout title="Ошибка">
    <a-error-page
      page-type="not-found"
      sub-title="Ошибка сервера, пожалуйста обновите страницу или вернитесь на главную"
    >
      <template #extra>
        <a-button
          type="primary"
          @click="goHome"
        >
          На главную
        </a-button>
      </template>
    </a-error-page>

    <template #breadcrumbs>
      <a-breadcrumb class="font-normal">
        <a-breadcrumb-item>
          <RouterLink :to="`${config.public.basePath}`">
            Главная
          </RouterLink>
        </a-breadcrumb-item>
        <a-breadcrumb-item>404</a-breadcrumb-item>
      </a-breadcrumb>
    </template>
  </the-layout>
</template>

<script setup lang="ts">
import { TheLayout } from '@/widgets/layout-shell';

import { useRuntimeConfig } from '#imports';

const config = useRuntimeConfig();

const goHome = (): void => {
  document.location.href = config.public.basePath;
};
</script>
