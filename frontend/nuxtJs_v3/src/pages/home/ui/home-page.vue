<template>
  <the-layout title="Главная">
    <a-card>
      <div class="flex items-center max-lg:flex-col gap-4 mobile-flex-column">
        <div class="w-full flex flex-col gap-4 mobile-text-center">
          <h1 class="text-5xl max-lg:text-4xl max-sm:text-3xl">
            TODO LIST
          </h1>
          <Text
            type="secondary"
            class="text-4xl max-lg:text-2xl max-sm:text-xl"
          >
            Планируй задачи – упрощай жизнь
          </Text>
          <div class="text-base">
            Простое решение для сложных задач
          </div>
          <div class="flex mobile-justify-center">
            <a-button
              size="large"
              type="primary"
              @click="router.push('/boards')"
            >
              Начать
            </a-button>
          </div>
        </div>

        <div class="w-full">
          <div ref="animationContainer" />
        </div>
      </div>
    </a-card>
  </the-layout>
</template>

<script setup lang="ts">
import { Typography } from 'ant-design-vue';
import lottie from 'lottie-web';

import { kanbanAnimationData } from '@/shared/illustration';
import { TheLayout } from '@/widgets/layout-shell';

import { useRouter } from '#imports';

const { Text } = Typography;

const router = useRouter();
const animationContainer = ref<HTMLDivElement | null>(null);

onMounted((): void => {
  lottie.loadAnimation({
    animationData: kanbanAnimationData,
    autoplay: true,
    container: animationContainer.value as HTMLDivElement,
    loop: true,
    renderer: 'svg',
  });

  const pageTitle = document.querySelector('.ant-the-page-title') as HTMLDivElement | null;
  if (pageTitle !== null) {
    pageTitle.style.display = 'none';
  }
});
</script>
