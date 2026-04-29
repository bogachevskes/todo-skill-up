<template>
  <NuxtPage />
</template>

<script setup lang="ts">
import { initializeThemePreference } from '@/app/entry/init-theme';

initializeThemePreference();
</script>

<style lang="scss">
.has-error {
  .ant-select-selector,
  .ant-picker-focused,
  .ant-picker,
  .ant-input {
    border-color: var(--color-error) !important;
  }
}
</style>

<style lang="scss" src="./assets/css/app.scss" />
