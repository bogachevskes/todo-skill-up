<template>
  <a-modal
    v-model:open="isShowModalState"
    :title="statusState ? 'Изменить статус' : 'Добавить статус'"
    @cancel="onCancel"
  >
    <a-form layout="vertical">
      <div class="ant-form-item-required">
        Название
      </div>

      <a-form-item
        :help="errors.name"
        layout="vertical"
        name="name"
        :validate-status="errors.name ? 'error' : undefined"
      >
        <a-input
          v-model:value="formState.name"
          type="text"
          placeholder="Введите название статуса"
          @input="delete errors.name"
          @press-enter="onSave"
        />
      </a-form-item>
    </a-form>

    <template #footer>
      <div class="text-right">
        <a-button @click="onCancel">
          Отмена
        </a-button>
        <a-button
          type="primary"
          :loading="isLoading"
          @click="onSave"
        >
          Сохранить
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import cloneDeep from 'lodash/cloneDeep';

import type { IStatus, IStatusForm } from '~/entities/status';
import { useApi } from '~/shared/network';
import { ERROR_MESSAGE } from '~/shared/validation';

import { useRoute } from '#imports';

const props = defineProps<{
  status?: IStatus | null;
  isShowModal: boolean;
}>();

const emit = defineEmits<{
  (event: 'on-cancel'): void;
  (event: 'on-save'): void;
}>();

const route = useRoute();

const statusState = ref(props.status);
const isShowModalState = ref(props.isShowModal);
const isLoading = ref(false);
const errors = ref<{ [key: string]: string }>({});

const initialFormState = {
  name: null,
} as IStatusForm;

const formState = ref(cloneDeep(initialFormState));

const fillFormData = (data: IStatus): void => {
  formState.value = {
    name: data?.name || null,
  };
};

if (props.status !== null) {
  fillFormData(props.status as IStatus);
}

watch(() => props.status, newVal => {
  statusState.value = newVal;

  if (newVal !== null) {
    fillFormData(newVal as IStatus);
    return;
  }

  formState.value = cloneDeep(initialFormState);
});

watch(() => props.isShowModal, isShowModal => {
  isShowModalState.value = isShowModal;
});

const onCancel = (): void => {
  errors.value = {};
  emit('on-cancel');
};

const requestSuccessHandler = (): void => {
  isLoading.value = false;
  emit('on-save');
  formState.value = cloneDeep(initialFormState);
};

const requiredFields: (keyof IStatusForm)[] = ['name'];
const validateFields = (): void => {
  requiredFields.forEach(v => {
    if (Boolean(formState.value[v]) === false) {
      errors.value[v] = ERROR_MESSAGE;
    }

    if ((formState.value[v] as string)?.length < 5) {
      errors.value[v] = 'Минимальное кол-во символов: 5';
    }
  });
};

const onSave = async (): Promise<void> => {
  validateFields();

  if (Object.keys(errors.value).length > 0) {
    return;
  }

  isLoading.value = true;

  // редактируем
  if (statusState.value !== null) {
    try {
      const response = await useApi(`/boards/${route.params?.id}/statuses/${statusState.value.id}`, {
        method: 'PUT',
        body: { formData: { ...formState.value } },
      }) as string;

      if (response === '') {
        message.success('Сохранено');
        requestSuccessHandler();
        return;
      }

      message.error('Ошибка сохранения');
    } catch (e) {
      message.error(e as string);
    }

    isLoading.value = false;
    return;
  }

  // добавляем
  try {
    const response = await useApi(`/boards/${route.params?.id}/statuses`, {
      method: 'POST',
      body: { formData: { ...formState.value } },
    }) as string;

    if (response === '') {
      message.success('Статус добавлен');
      requestSuccessHandler();
      return;
    }

    message.error('Ошибка добавления');
  } catch (e) {
    message.error(e as string);
  }

  isLoading.value = false;
};
</script>
