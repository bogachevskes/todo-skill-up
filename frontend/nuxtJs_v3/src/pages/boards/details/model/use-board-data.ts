import { ref, type Ref } from 'vue';

import type { IBoard } from '@/entities/board';
import type { IStatusResponse } from '@/entities/status';
import { checkErrorStatus } from '@/shared/feedback';
import { useApi } from '@/shared/network';

import { useAsyncData } from '#imports';

type BoardId = string | string[] | undefined;

type UseBoardDataResult = {
  board: Ref<IBoard | null>;
  statuses: Ref<IStatusResponse[]>;
  loadBoard: () => Promise<void>;
  loadStatuses: () => Promise<void>;
};

export const useBoardData = (boardId: BoardId, userId: string): UseBoardDataResult => {
  const board = ref<IBoard | null>(null);
  const statuses = ref<IStatusResponse[]>([]);

  const normalizedBoardId = Array.isArray(boardId) ? boardId[0] : boardId;

  const loadBoard = async (): Promise<void> => {
    const { data, status } = await useAsyncData<IBoard>(
      `/user/${userId}/boards/${normalizedBoardId}`,
      () => useApi<IBoard>(`/user/${userId}/boards/${normalizedBoardId}`, { method: 'GET' }),
    );

    checkErrorStatus(status.value, 'Ошибка получения данных доски');
    board.value = data.value;
  };

  const loadStatuses = async (): Promise<void> => {
    const { data, status } = await useAsyncData<IStatusResponse[]>(
      `/boards/${normalizedBoardId}/tasks`,
      () => useApi<IStatusResponse[]>(`/boards/${normalizedBoardId}/tasks`, { method: 'GET' }),
    );

    checkErrorStatus(status.value, 'Ошибка получения статусов');
    statuses.value = data.value || [];
  };

  return {
    board,
    statuses,
    loadBoard,
    loadStatuses,
  };
};
