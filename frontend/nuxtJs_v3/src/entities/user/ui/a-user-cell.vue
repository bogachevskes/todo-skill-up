<template>
  <div class="a-user-cell">
    <a-flex
      gap="small"
      align="center"
    >
      <img
        v-if="avatar"
        class="a-user-cell__avatar"
        :src="avatar"
        :alt="title"
      >
      <a-flex
        gap="0"
        vertical
      >
        <a-typography-text>
          <span class="a-user-cell__title">{{ title }}</span>
        </a-typography-text>
        <a-typography-text type="secondary">
          <span class="a-user-cell__description">{{ description }}</span>
        </a-typography-text>
      </a-flex>
    </a-flex>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  avatar?: string;
  title?: string;
  description?: string;
}>(), {
  avatar: '',
  title: '',
  description: '',
});
</script>

<style scoped lang="scss">
.a-user-cell {
  &__avatar {
    display: block;
    width: 44px;
    min-width: 44px;
    height: 44px;
    border-radius: 9999px;
  }

  &__description {
    font-size: 12px;
    line-height: 16px;
    font-weight: 500;
  }

  &__title {
    font-size: 14px;
  }
}
</style>
