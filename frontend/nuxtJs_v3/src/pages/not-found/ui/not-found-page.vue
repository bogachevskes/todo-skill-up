<template>
  <the-layout title="Страница не найдена">
    <div class="flex flex-col items-center justify-center">
      <no-found-illustration class="w-full max-w-md" />
    </div>

    <template #breadcrumbs>
      <a-breadcrumb class="font-normal">
        <a-breadcrumb-item>
          <RouterLink :to="'/'">
            Главная
          </RouterLink>
        </a-breadcrumb-item>
        <a-breadcrumb-item>404</a-breadcrumb-item>
      </a-breadcrumb>
    </template>
  </the-layout>
</template>

<script setup lang="ts">
import { NoFoundIllustration } from '@/shared/illustration';
import { TheLayout } from '@/widgets/layout-shell';

</script>
