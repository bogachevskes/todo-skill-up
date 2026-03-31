<template>
  <the-layout
    :title="board?.name || ''"
    :is-has-sider="true"
  >
    <template #siderMenu>
      <board-info :board="board" />
    </template>

    <template #breadcrumbs>
      <a-breadcrumb class="font-normal">
        <a-breadcrumb-item>
          <RouterLink :to="`${config.public.basePath}`">
            Главная
          </RouterLink>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <RouterLink :to="`${config.public.basePath}boards`">
            Доски
          </RouterLink>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ board?.name || '' }}</a-breadcrumb-item>
      </a-breadcrumb>
    </template>

    <a-flex
      vertical
      gap="middle"
    >
      <a-card class="hidden tablet-visible">
        <board-info :board="board" />
      </a-card>

      <a-card>
        <template #title>
          <div class="flex justify-between gap-2 items-center">
            <div class="text-base">
              Статусы
            </div>

            <a-flex gap="small">
              <members-actions
                :user-board-permissions="userBoardPermissions"
                :board-id="Number(boardId)"
              />
              <a-button
                v-if="userHasBoardPermission('manage-board-statuses')"
                class="user-action-btn"
                type="primary"
                :icon="h(PlusOutlined)"
                @click="onAddStatus"
              >
                Добавить статус
              </a-button>
            </a-flex>
          </div>
        </template>

        <empty-status
          v-if="statuses.length === 0"
          :is-manage="userHasBoardPermission('manage-board-statuses')"
          @on-add-status="onAddStatus"
        />

        <div
          v-else
          class="flex overflow-hidden overflow-x-auto gap-4"
        >
          <board-column
            v-for="status in statuses"
            :key="status.status.id"
            :title="status.status.name"
            :bg-color="token.colorBgLayout"
          >
            <template #title-button>
              <board-column-actions
                :status="status.status"
                :is-manage="userHasBoardPermission('manage-board-statuses')"
                :is-delete="userHasBoardPermission('delete-board-statuses')"
                @on-add-task="onAddTask"
                @on-delete-status="onDeleteStatus"
                @on-edit-status="onEditStatus"
              />
            </template>

            <draggable
              :id="status.status.id"
              class="w-full flex flex-col gap-2 h-full"
              :list="status.tasks"
              group="tasks"
              @start="onDragStart"
              @end="onDragEnd"
            >
              <template #item="{ element }">
                <task-item
                  :title="element.name"
                  :description="element.description"
                  :created-at="dayjs(element.createdAt).format('DD.MM.YYYY')"
                  :due-date="dayjs(element.plannedCompletionAt).format('DD.MM.YYYY')"
                  @on-edit="onEditTask(element)"
                  @on-delete="onDeleteTask(element.id)"
                />
              </template>
            </draggable>
          </board-column>
        </div>
      </a-card>

      <status-form
        :is-show-modal="isShowModalFormStatus"
        :status="selectedStatus"
        @on-cancel="onCancelEditStatus"
        @on-save="onSaveStatus"
      />

      <task-form
        :is-show-modal="isShowModalFormTask"
        :task="selectedTask"
        :status-id="currentStatusId"
        @on-cancel="onCancelEditTask"
        @on-save="onSaveTask"
      />
    </a-flex>
  </the-layout>
</template>

<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useToken } from 'ant-design-vue/es/theme/internal';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import draggable from 'vuedraggable';

import {
  BoardInfo,
} from '@/entities/board';
import {
  BoardColumn,
  BoardColumnActions,
  EmptyStatus,
  TaskItem,
  type IStatus,
  type ITask,
} from '@/entities/status';
import { MembersActions } from '@/features/members-control';
import { StatusForm } from '@/features/status-editor';
import { TaskForm } from '@/features/task-editor';
import { useApi } from '@/shared/network';
import { TheLayout } from '@/widgets/layout-shell';

import { useCookie, useRoute, useRuntimeConfig } from '#imports';

import {
  useBoardData, useBoardPermissions,
  useBoardSocket,
} from '../model';

const { onTaskCreated, onTaskDeleted, onTaskStateChanged } = useBoardSocket();
const route = useRoute();
const config = useRuntimeConfig();
const userId = useCookie('userId');
const [, token] = useToken();
const boardId = route.params?.id;

const isShowModalFormStatus = ref(false);
const isShowModalFormTask = ref(false);

const selectedStatus = ref<IStatus | null>(null);
const selectedTask = ref<ITask | null>(null);
const currentStatusId = ref<number | null>(null);

const { board, statuses, loadBoard, loadStatuses } = useBoardData(boardId, userId.value || '');
const { userBoardPermissions, loadUserBoardPermissions, userHasBoardPermission } = useBoardPermissions(boardId, userId.value || '');

await loadBoard();
loadUserBoardPermissions();
await loadStatuses();

const onAddStatus = (): void => {
  isShowModalFormStatus.value = true;
  selectedStatus.value = null;
};

const onEditStatus = (status: IStatus): void => {
  isShowModalFormStatus.value = true;
  selectedStatus.value = cloneDeep(status);
};

const onCancelEditStatus = (): void => {
  selectedStatus.value = null;
  isShowModalFormStatus.value = false;
};

const onSaveStatus = (): void => {
  loadStatuses();
  onCancelEditStatus();
};

const onDeleteStatus = async (id: number): Promise<void> => {
  try {
    await useApi<string>(`boards/${boardId}/statuses/${id}`, { method: 'DELETE' });
    await loadStatuses();
  } catch (error) {
    message.error(error as string);
  }
};

const onAddTask = (statusId: number): void => {
  isShowModalFormTask.value = true;
  selectedTask.value = null;
  currentStatusId.value = statusId;
};

const onEditTask = (task: ITask): void => {
  isShowModalFormTask.value = true;
  selectedTask.value = cloneDeep(task);
  currentStatusId.value = task.statusId;
};

const onCancelEditTask = (): void => {
  selectedTask.value = null;
  currentStatusId.value = null;
  isShowModalFormTask.value = false;
};

const onSaveTask = (): void => {
  loadStatuses();
  onCancelEditTask();
};

const onDeleteTask = async (id: number): Promise<void> => {
  try {
    await useApi<string>(`boards/${boardId}/tasks/${id}`, { method: 'DELETE' });
    await loadStatuses();
  } catch (error) {
    message.error(error as string);
  }
};

type DragStartEvent = {
  item?: HTMLDivElement & {
    __draggable_context?: {
      element?: ITask;
    };
  };
};

const onDragStart = (event: unknown): void => {
  const castedEvent = event as DragStartEvent;

  castedEvent.item?.classList?.add('drag-active');
  selectedTask.value = castedEvent.item?.__draggable_context?.element || null;
};

type DragEndEvent = {
  item?: HTMLDivElement;
  to: HTMLDivElement;
};

const onDragEnd = async (event: unknown): Promise<void> => {
  const castedEvent = event as DragEndEvent;

  castedEvent.item?.classList?.remove('drag-active');

  if (selectedTask.value === null) {
    return;
  }

  try {
    const response = await useApi<string>(`/boards/${boardId}/tasks/${selectedTask.value.id}`, {
      method: 'PUT',
      body: {
        formData: {
          ...selectedTask.value,
          statusId: Number(castedEvent.to.id),
        },
      },
    });

    if (response === '') {
      await loadStatuses();
      selectedTask.value = null;
      return;
    }

    message.error('Ошибка сохранения');
  } catch (error) {
    message.error(error as string);
  }

  selectedTask.value = null;
};

onTaskCreated.value = (): void => {
  loadStatuses();
};

onTaskStateChanged.value = (): void => {
  loadStatuses();
};

onTaskDeleted.value = (): void => {
  loadStatuses();
};
</script>

<style src="~/pages/boards/model/style.scss" />
