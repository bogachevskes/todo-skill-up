<template>
  <a-flex
    vertical
    gap="small"
  >
    <div>
      <a-form layout="vertical">
        <a-form-item label="Поиск по email">
          <a-select
            v-model:value="selected"
            :filter-option="false"
            :options="options"
            mode="multiple"
            placeholder="Введите email"
            label-in-value
            :not-found-content="isSearching ? undefined : null"
            @search="search"
            @blur="onBlur"
          >
            <template
              v-if="isSearching"
              #notFoundContent
            >
              <a-spin size="small" />
            </template>
          </a-select>
        </a-form-item>
      </a-form>

      <a-button
        type="primary"
        :loading="isLoadAdd"
        @click="onAdd"
      >
        Добавить
      </a-button>
    </div>
    <div
      v-if="users.length > 0"
      class="flex flex-col gap-2 mt-5"
    >
      <div class="font-semibold">
        Участники
      </div>

      <div
        v-for="user in users"
        :key="user.id"
        class="flex items-center gap-2 justify-between"
      >
        <a-tag>
          {{ user.email }}
        </a-tag>

        <a-flex gap="small">
          <a-tooltip
            title="Разрешения"
            placement="top"
          >
            <a-button
              size="small"
              :icon="h(LockOutlined)"
              @click="onPermissions(user)"
            />
          </a-tooltip>
          <a-tooltip
            title="Удалить"
            placement="top"
          >
            <a-button
              size="small"
              danger
              :icon="h(DeleteOutlined)"
              @click="onDelete(user)"
            />
          </a-tooltip>
        </a-flex>
      </div>
    </div>

    <a-modal
      v-model:open="isShowModalPermissions"
      :title="`Разрешения пользователя ${selectedUser?.name || ''}`"
      :footer="null"
    >
      <div class="flex flex-col gap-2 mt-5">
        <div
          v-for="(item, key) in PERMISSIONS"
          :key="key"
          class="flex items-center gap-2"
        >
          <a-switch
            :checked="userPermissions.includes(key)"
            @change="switchPermission(key)"
          />
          <span>{{ item }}</span>
        </div>
      </div>
    </a-modal>

    <a-modal
      v-model:open="isShowModalDelete"
      title="Вы уверены, что хотите удалить участника?"
      cancel-text="Отменить"
      ok-text="Да"
      :ok-button-props="{ disabled: selectedUser?.name !== confirmUserName }"
      @cancel="onCancelDelete"
      @ok="onConfirmDelete"
    >
      <label class="flex gap-2 flex-col">
        <span class="text-sm">
          Для удаления пользователя введите <a-tag>{{ selectedUser?.name }}</a-tag>
        </span>
        <a-input
          v-model:value="confirmUserName"
          placeholder="Имя пользователя"
          @keyup.enter="onConfirmDelete"
        />
      </label>
    </a-modal>
  </a-flex>
</template>

<script lang="ts" setup>
import { LockOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { debounce } from 'lodash';

import type { IOption, IUser } from '~/entities/user';
import { useApi } from '~/shared/network';

import { useCookie, useRoute } from '#imports';

const PERMISSIONS = {
  'delete-board': 'Удаление досок',
  'delete-board-statuses': 'Удаление статусов досок',
  'manage-board': 'Управление досками',
  'manage-board-statuses': 'Управление статусами досок',
  'manage-board-users': 'Управление пользователями досок',
};

const route = useRoute();
const userId = useCookie('userId');
const boardId = route.params?.id;

const props = defineProps<{
  users: IUser[];
}>();

const emit = defineEmits<{
  (event: 'on-refresh'): void;
}>();

const selected = ref<IOption[]>([]);
const options = ref<IOption[]>([]);
const isSearching = ref(false);
const isLoadAdd = ref(false);
const isShowModalDelete = ref(false);
const selectedUser = ref<null | IUser>(null);
const isShowModalPermissions = ref(false);
const userPermissions = ref<string[]>([]);
const confirmUserName = ref<string>('');

const excludeById = (arr1: IUser[], arr2: IUser[]): IUser[] => {
  const idsToExclude = new Set(arr2.map(item => item.id));
  return arr1.filter(item => !idsToExclude.has(item.id));
};

const onBlur = (): void => {
  options.value = [];
};

const search = debounce(async (value: string): Promise<void> => {
  if (value.length === 0 || Boolean(value.includes('@')) === false) {
    options.value = [];
    return;
  }

  isSearching.value = true;

  try {
    const response = await useApi(`/users/match/?email=${value}`, {
      method: 'GET',
    }) as { items: IUser[] };

    if (Boolean(response) === true && Boolean(response.items) === true) {
      options.value = excludeById(
        response.items.filter(v => v.id !== Number(userId.value)), props.users
      ).map(item => ({
        label: item.email,
        value: item.id
      }));

      isSearching.value = false;
      return;
    }

    options.value = [];
  } catch (e) {
    console.error(e);
  }

  isSearching.value = false;
}, 300);

const onAdd = async (): Promise<void> => {
  isLoadAdd.value = true;

  const ids = selected.value.map(v => v.value);

  try {
    const response = await useApi(`/boards/${boardId}/users`, {
      method: 'POST',
      body: { formData: { ids } },
    }) as '';

    if (response === '') {
      isLoadAdd.value = false;
      message.success('Участники добавлены');
      selected.value = [];
      emit('on-refresh');
      return;
    }

    isLoadAdd.value = false;
    message.error('Ошибка при добавлении пользователей к доске');
  } catch (e) {
    message.error(e as string);
  }
  isLoadAdd.value = false;
  selected.value = [];
};

const onDelete = (user: IUser): void => {
  selectedUser.value = user;
  isShowModalDelete.value = true;
};

const onConfirmDelete = async (): Promise<void> => {
  try {
    await useApi(`/boards/${boardId}/users/${selectedUser.value?.id}`, { method: 'DELETE' });
    emit('on-refresh');

    onCancelDelete();
  } catch (e) {
    message.error(e as string);
  }
};

const onCancelDelete = (): void => {
  selectedUser.value = null;
  isShowModalDelete.value = false;
  confirmUserName.value = '';
};

const onPermissions = async (user: IUser): Promise<void> => {
  try {
    const response = await useApi(`/boards/${boardId}/users/${user.id}/permissions`, { method: 'GET' }) as string[];

    if (Boolean(response) === false) {
      message.error('Не удалось получить разрешения пользователя');
      return;
    }

    selectedUser.value = user;
    isShowModalPermissions.value = true;
    userPermissions.value = response;
  } catch (e) {
    message.error(e as string);
  }
};

const checkPermission = (permission: string): void => {
  const index = userPermissions.value.findIndex(v => v === permission);

  if (index > -1) {
    userPermissions.value.splice(index, 1);
    return;
  }

  userPermissions.value.push(permission);
};

const switchPermission = async (permission: string): Promise<void> => {
  const method = userPermissions.value.includes(permission) ? 'DELETE' : 'PUT';
  checkPermission(permission);

  try {
    await useApi(`/boards/${boardId}/users/${selectedUser.value?.id}/permissions/${permission}`, { method }) as string;
  } catch (e) {
    message.error(e as string);
  }
};
</script>
