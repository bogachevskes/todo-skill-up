<template>
  <a-modal
    v-model:open="isShowModalState"
    :title="taskState ? 'Изменить задачу' : 'Добавить задачу'"
    @cancel="onCancel"
  >
    <a-form
      :model="formState"
      layout="vertical"
    >
      <div class="ant-form-item-required">
        Название
      </div>
      <a-form-item
        label=""
        name="name"
        :validate-status="errors.name ? 'error' : undefined"
        :help="errors.name"
      >
        <a-input
          v-model:value="formState.name"
          placeholder="Введите название задачи"
          @input="delete errors.name"
          @press-enter="onSave"
        />
      </a-form-item>
      <div class="ant-form-item-required">
        Дата выполнения
      </div>
      <a-form-item
        name="plannedCompletionAt"
        :validate-status="errors.plannedCompletionAt ? 'error' : undefined"
        :help="errors.plannedCompletionAt"
      >
        <a-date-picker
          v-model:value="formState.plannedCompletionAt"
          v-mask="'##.##.####'"
          class="w-full"
          :format="`DD.MM.YYYY`"
          placeholder="__.__.____"
          @change="delete errors.plannedCompletionAt"
        />
      </a-form-item>
      <div class="ant-form-item-required">
        Описание
      </div>
      <a-form-item
        name="description"
        :validate-status="errors.description ? 'error' : undefined"
        :help="errors.description"
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
import dayjs from 'dayjs';
import cloneDeep from 'lodash/cloneDeep';

import type { ITask, ITaskForm } from '~/entities/status';
import { useApi } from '~/shared/network';
import { ERROR_MESSAGE } from '~/shared/validation';

import { useRoute } from '#imports';

const props = defineProps<{
  task?: ITask | null;
  statusId?: number | null;
  isShowModal: boolean;
}>();

const emit = defineEmits<{
  (event: 'on-cancel'): void;
  (event: 'on-save'): void;
}>();

const route = useRoute();

const taskState = ref(props.task);
const isShowModalState = ref(props.isShowModal);
const isLoading = ref(false);
const errors = ref<{ [key: string]: string }>({});

const initialFormState = {
  name: null,
  description: null,
  plannedCompletionAt: null
} as ITaskForm;

const formState = ref(cloneDeep(initialFormState));

const fillFormData = (data: ITask): void => {
  formState.value = {
    name: data?.name || null,
    description: data?.description || null,
    plannedCompletionAt: data?.plannedCompletionAt ? dayjs(data.plannedCompletionAt) : null,
  };
};

if (props.task !== null) {
  fillFormData(props.task as ITask);
}

watch(() => props.task, newVal => {
  taskState.value = newVal;

  if (newVal !== null) {
    fillFormData(newVal as ITask);
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

const requiredFields: (keyof ITaskForm)[] = ['name', 'description', 'plannedCompletionAt'];
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
  if (Boolean(taskState.value) === true) {
    try {
      const response = await useApi(`/boards/${route.params?.id}/tasks/${taskState.value?.id}`, {
        method: 'PUT',
        body: {
          formData: {
            ...formState.value,
            boardId: taskState.value?.boardId,
            id: taskState.value?.id,
            statusId: props.statusId
          }
        },
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
    const response = await useApi(`/boards/${route.params?.id}/tasks`, {
      method: 'POST',
      body: {
        formData: {
          ...formState.value,
          statusId: props.statusId 
        } 
      },
    }) as string;

    if (response === '') {
      message.success('Задача добавлена');
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
