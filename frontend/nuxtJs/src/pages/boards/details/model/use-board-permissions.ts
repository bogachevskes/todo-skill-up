import { ref, type Ref } from 'vue';

import { checkErrorStatus } from '~/shared/feedback';
import { useApi } from '~/shared/network';

type UseBoardPermissionsResult = {
  userBoardPermissions: Ref<string[]>;
  loadUserBoardPermissions: () => Promise<void>;
  userHasBoardPermission: (permission: string) => boolean;
};

export const useBoardPermissions = (boardId: string | string[], userId: string): UseBoardPermissionsResult => {
  const userBoardPermissions = ref<string[]>([]);

  const loadUserBoardPermissions = async (): Promise<void> => {
    const { data, status } = await useAsyncData<string[]>(
      `/boards/${boardId}/users/${userId}/permissions`,
      () => useApi(`/boards/${boardId}/users/${userId}/permissions`, { method: 'GET' }) as Promise<string[]>
    );
    checkErrorStatus(status.value, 'Ошибка получения разрешений пользователя');
    userBoardPermissions.value = data.value || [];
  };

  const userHasBoardPermission = (permission: string): boolean => {
    return userBoardPermissions.value.includes(permission);
  };

  return {
    userBoardPermissions,
    loadUserBoardPermissions,
    userHasBoardPermission,
  };
};
