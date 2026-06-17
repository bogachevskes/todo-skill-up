<template>
  <the-layout title="Вход">
    <a-card
      class="w-[380px] mx-auto max-lg:w-full"
      title="Вход"
    >
      <a-form layout="vertical">
        <div class="ant-form-item-required">
          Email
        </div>
        <a-form-item
          :help="errors.email"
          class="mb-3"
          layout="vertical"
          name="email"
          :validate-status="errors.email ? 'error' : undefined"
        >
          <a-input
            v-model:value="formState.email"
            type="text"
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
          name="password"
          :validate-status="errors.password ? 'error' : undefined"
        >
          <a-input
            v-model:value="formState.password"
            label="Пароль"
            type="password"
            placeholder="Введите пароль"
            @input="delete errors.password"
            @keyup.enter="onSubmit"
          />
        </a-form-item>
      </a-form>

      <div class="text-left">
        <a-button
          type="primary"
          :loading="isLoading"
          @click="onSubmit"
        >
          Войти
        </a-button>
        <a-button
          style="margin-left: 10px"
          @click="router.push('/')"
        >
          Отменить
        </a-button>
      </div>
    </a-card>

    <template #breadcrumbs>
      <a-breadcrumb class="font-normal">
        <a-breadcrumb-item>
          <RouterLink :to="'/'">
            Главная
          </RouterLink>
        </a-breadcrumb-item>
        <a-breadcrumb-item>Вход</a-breadcrumb-item>
      </a-breadcrumb>
    </template>
  </the-layout>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import cloneDeep from 'lodash/cloneDeep';

import type { ISignIn, ISignInResponse } from '~/shared/account';
import { useApi } from '~/shared/network';
import { EMAIL_PATTERN, ERROR_EMAIL, ERROR_MESSAGE } from '~/shared/validation';
import { TheLayout } from '~/widgets/layout-shell';

import { useCookie, useRouter } from '#imports';

const router = useRouter();

const errors = ref<{ [key: string]: string }>({});
const isLoading = ref<boolean>(false);
const cookieToken = useCookie('token');
const cookieUser = useCookie('userId');

const initialFormState = {
  email: null,
  password: null
} as ISignIn;

const formState = ref<ISignIn>(cloneDeep(initialFormState));

const checkPassword = (): void => {
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

const requiredFields: (keyof ISignIn)[] = ['email', 'password'];
const validateFields = (): void => {
  requiredFields.forEach((v) => {
    if (Boolean(formState.value[v]) === false) {
      errors.value[v as string] = ERROR_MESSAGE;
    }
  });

  checkEmail();
  checkPassword();
};

const onSubmit = async (): Promise<void> => {
  validateFields();

  if (Object.keys(errors.value).length > 0) {
    return;
  }

  isLoading.value = true;

  try {
    const response = await useApi('/auth/signin', {
      method: 'POST',
      body: { formData: { ...formState.value } },
    }) as ISignInResponse;

    if (Boolean(response.token) === true) {
      cookieToken.value = response.token;
      cookieUser.value = `${response.userId}`;

      router.push('/boards');

      isLoading.value = false;
      return;
    }

    message.error('Ошибка авторизации');
  } catch (e) {
    message.error(e as string);
  }

  isLoading.value = false;
};

</script>
