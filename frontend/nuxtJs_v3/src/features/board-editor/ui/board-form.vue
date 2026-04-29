<template>
  <a-modal
    v-model:open="isShowModalState"
    :title="boardState ? 'Изменить доску' : 'Добавить доску'"
    @cancel="onCancel"
  >
    <a-form
      :style="{ '--color-error': token.colorError }"
      layout="vertical"
    >
      <div class="ant-form-item-required">
        Название
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
          view="text"
          placeholder="Введите название доски"
          @input="delete errors.name"
          @press-enter="onSave"
        />
      </a-form-item>
      <div class="ant-form-item-required">
        Описание
      </div>
      <a-form-item
        :help="errors.description"
        class="mb-3"
        layout="vertical"
        name="description"
        :validate-status="errors.description ? 'error' : undefined"
      >
        <a-textarea
          v-model:value="formState.description"
          placeholder="Введите описание"
          @input="delete errors.description"
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
import { useToken } from 'ant-design-vue/es/theme/internal';
import cloneDeep from 'lodash/cloneDeep';

import type { IBoard, IBoardForm } from '~/entities/board';
import { useApi } from '~/shared/network';
import { ERROR_MESSAGE } from '~/shared/validation';

import { useCookie } from '#imports';

const [, token] = useToken();
const userId = useCookie('userId');

const props = defineProps<{
  board?: IBoard | null;
  isShowModal: boolean;
}>();

const emit = defineEmits<{
  (event: 'on-cancel'): void;
  (event: 'on-save'): void;
}>();

const boardState = ref(props.board);
const isShowModalState = ref(props.isShowModal);
const isLoading = ref(false);
const errors = ref<{ [key: string]: string }>({});

const initialFormState = {
  name: null,
  description: null,
} as IBoardForm;

const formState = ref<IBoardForm>(cloneDeep(initialFormState));

const fillFormData = (data: IBoard): void => {
  formState.value = {
    name: data?.name || null,
    description: data?.description || null,
  };
};

if (props.board !== null) {
  fillFormData(props.board as IBoard);
}

watch(() => props.board, newVal => {
  boardState.value = newVal;

  if (newVal !== null) {
    fillFormData(newVal as IBoard);
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

const requiredFields: (keyof IBoardForm)[] = ['name', 'description'];
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

const requestSuccessHandler = (): void => {
  isLoading.value = false;
  emit('on-save');
  formState.value = cloneDeep(initialFormState);
};

const onSave = async (): Promise<void> => {
  validateFields();

  if (Object.keys(errors.value).length > 0) {
    return;
  }

  isLoading.value = true;

  // редактируем
  if (boardState.value !== null) {
    try {
      const response = await useApi(`/user/${userId.value}/boards/${boardState.value.id}`, {
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
    const response = await useApi(`/user/${userId.value}/boards`, {
      method: 'POST',
      body: { formData: { ...formState.value } },
    }) as string;

    if (response === '') {
      message.success('Доска успешно добавлена');
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
