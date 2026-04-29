<template>
  <the-layout title="Регистрация">
    <a-card
      class="w-[380px] mx-auto max-lg:w-full"
      title="Регистрация"
    >
      <a-form layout="vertical">
        <div class="ant-form-item-required">
          Имя
        </div>

        <a-form-item
          :help="errors.name"
          class="mb-3"
          layout="vertical"
          name="name"
          :validate-status="errors.name ? 'error' : undefined"
        >
          <a-input
            v-model:value="formState.name"
            placeholder="Введите ваше имя"
            @input="delete errors.name"
            @keyup.enter="onSubmit"
          />
        </a-form-item>
        <div class="ant-form-item-required">
          Email
        </div>

        <a-form-item
          :help="errors.name"
          class="mb-3"
          layout="vertical"
          name="email"
          :validate-status="errors.email ? 'error' : undefined"
        >
          <a-input
            v-model:value="formState.email"
            placeholder="example@example.com"
            @input="delete errors.email"
            @keyup.enter="onSubmit"
          />
        </a-form-item>
        <div class="ant-form-item-required">
          Пароль
        </div>

        <a-form-item
          :help="errors.password"
          class="mb-3"
          layout="vertical"
          name="name"
          :validate-status="errors.password ? 'error' : undefined"
        >
          <a-input
            v-model:value="formState.password"
            type="password"
            placeholder="Введите пароль"
            @input="delete errors.password"
            @keyup.enter="onSubmit"
          />
        </a-form-item>
        <div class="ant-form-item-required">
          Подтвердите пароль
        </div>

        <a-form-item
          :help="errors.confirm_password"
          class="mb-3"
          layout="vertical"
          name="confirm_password"
          :validate-status="errors.confirm_password ? 'error' : undefined"
        >
          <a-input
            v-model:value="formState.confirm_password"
            type="password"
            placeholder="Введите пароль"
            @input="delete errors.confirm_password"
            @keyup.enter="onSubmit"
          />
        </a-form-item>
      </a-form>

      <label class="mb-3 ">
        <a-checkbox
          v-model:checked="formState.terms_agree"
          @change="delete errors.terms_agree"
        >
          Принимаю <a
            class="underline"
            :href="`${config.public.basePath}terms`"
          >условия пользования</a>
          сервисом
        </a-checkbox>
        <div
          v-if="errors.terms_agree"
          :style="{ color: token.colorError }"
        >
          Для регистрации необходимо ваше согласие с условиями сервиса
        </div>
      </label>

      <div class="text-left mt-3 max-lg:flex max-lg:w-full max-lg:flex-row ">
        <a-button
          type="primary"
          :loading="isLoading"
          @click="onSubmit"
        >
          Зарегистрироваться
        </a-button>
        <a-button
          style="margin-left: 10px"
          @click="router.push(`${config.public.basePath}`)"
        >
          Отменить
        </a-button>
      </div>
    </a-card>

    <template #breadcrumbs>
      <a-breadcrumb class="font-normal">
        <a-breadcrumb-item>
          <RouterLink :to="`${config.public.basePath}`">
            Главная
          </RouterLink>
        </a-breadcrumb-item>
        <a-breadcrumb-item>Регистрация</a-breadcrumb-item>
      </a-breadcrumb>
    </template>
  </the-layout>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import { useToken } from 'ant-design-vue/es/theme/internal';
import cloneDeep from 'lodash/cloneDeep';

import type { ISignUp, ISignInResponse } from '~/shared/account';
import { useApi } from '~/shared/network';
import { EMAIL_PATTERN, ERROR_EMAIL, ERROR_MESSAGE } from '~/shared/validation';
import { TheLayout } from '~/widgets/layout-shell';

import { useCookie, useRouter, useRuntimeConfig } from '#imports';

const router = useRouter();
const config = useRuntimeConfig();
const [, token] = useToken();

const errors = ref<{ [key: string]: string }>({});
const isLoading = ref<boolean>(false);

const initialFormState = {
  name: null,
  email: null,
  password: null,
  confirm_password: null,
  terms_agree: true,
} as ISignUp;

const formState = ref<ISignUp>(cloneDeep(initialFormState));
const cookieToken = useCookie('token');
const cookieUser = useCookie('userId');

const checkPassword = (): void => {

  if (formState.value.password !== formState.value.confirm_password) {
    errors.value.confirm_password = 'Пароли не совпадают';
  }

  if (Boolean(formState.value.password) === true && formState.value.password.length < 3) {
    errors.value.password = 'Пароль не должен быть меньше 3 символов';
  }

  if (Boolean(formState.value.password) === true && /[А-Я-Ё]/gi.test(formState.value.password) === true) {
    errors.value.password = 'Пароль не должен содержать кириллицу';
  }
};

const checkEmail = (): void => {
  if (EMAIL_PATTERN.test(formState.value.email as string) === false) {
    errors.value.email = ERROR_EMAIL;
  }
};

const checkConfirm = (): void => {
  if (formState.value.terms_agree === false) {
    errors.value.terms_agree = ERROR_MESSAGE;
  }
};

const requiredFields: (keyof ISignUp)[] = ['name', 'email', 'password', 'password'];
const validateFields = (): void => {
  requiredFields.forEach(v => {
    if (Boolean(formState.value[v]) === false) {
      errors.value[v as string] = ERROR_MESSAGE;
    }
  });

  checkEmail();
  checkPassword();
  checkConfirm();
};

const login = async (): Promise<void> => {
  try {
    const response = await useApi('/auth/signin', {
      method: 'POST',
      body: {
        formData: {
          email: formState.value.email,
          password: formState.value.password
        }
      },
    }) as ISignInResponse;

    if (Boolean(response.token) === true) {
      cookieToken.value = response.token;
      cookieUser.value = `${response.userId}`;

      router.push(`${config.public.basePath}boards`);
      return;
    }

    message.error('Не удалось войти в аккаунт');
  } catch (e) {
    console.error(e);
    message.error('Не удалось войти в аккаунт');
  }
};

const onSubmit = async (): Promise<void> => {
  validateFields();

  if (Object.keys(errors.value).length > 0) {
    return;
  }

  isLoading.value = true;

  try {
    const response = await useApi('/auth/signup', {
      method: 'PUT',
      body: { formData: { ...formState.value } },
    }) as string;

    if (response === '') {
      await login();
      isLoading.value = false;
      return;
    }

    message.error('Ошибка регистрации');
  } catch (e) {
    message.error(e as string);
  }

  isLoading.value = false;
};

</script>
