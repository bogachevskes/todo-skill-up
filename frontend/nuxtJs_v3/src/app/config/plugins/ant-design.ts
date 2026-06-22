import { defineNuxtPlugin } from '#app';
import Ui from 'ant-design-vue';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Ui);
});
