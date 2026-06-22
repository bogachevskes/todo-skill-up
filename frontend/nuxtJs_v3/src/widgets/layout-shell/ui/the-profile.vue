<template>
  <a-button
    v-if="token"
    @click="logout"
  >
    Выйти
  </a-button>
  <div
    v-else
    class="flex items-center gap-2"
  >
    <a-button @click="router.push('/signup')">
      Регистрация
    </a-button>
    <a-button
      type="primary"
      @click="router.push('/signin')"
    >
      Вход
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { useCookie, useRouter } from '#imports';
const router = useRouter();

const token = useCookie('token');

const logout = (): void => {
  token.value = null;
  router.push('/signin');
};
</script>
