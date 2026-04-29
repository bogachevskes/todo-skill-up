import { defineNuxtPlugin } from '#app';
import Ui from 'ant-design-vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Ui);
});
