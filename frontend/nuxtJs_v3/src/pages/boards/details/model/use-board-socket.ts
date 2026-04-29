import { message } from 'ant-design-vue';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';

import { SOCKET_AUTH_ERRORS } from '@/shared/realtime';

import { useCookie, useNuxtApp, useRoute } from '#imports';

import type { Socket } from 'socket.io-client';
type SocketCallback = () => void;

type SocketService = {
  addConnection: (key: string, socket: Socket) => void;
  create: (namespace?: string, options?: object) => Socket;
  detachConnection: (key: string) => void;
  getConnection: (key: string) => Socket;
};

type UseBoardSocketResult = {
  onTaskCreated: Ref<SocketCallback | null>;
  onTaskDeleted: Ref<SocketCallback | null>;
  onTaskStateChanged: Ref<SocketCallback | null>;
  socketClient: Ref<Socket | null>;
};

export const useBoardSocket = (): UseBoardSocketResult => {
  const { $socket } = useNuxtApp() as unknown as { $socket: SocketService };
  const route = useRoute();
  const socketClient = ref<Socket | null>(null);
  const token = useCookie('token');

  const onTaskCreated = ref<SocketCallback | null>(null);
  const onTaskStateChanged = ref<SocketCallback | null>(null);
  const onTaskDeleted = ref<SocketCallback | null>(null);

  const resolveBoardId = (): number | null => {
    const routeParam = route.params?.id;
    const value = Array.isArray(routeParam) ? routeParam[0] : routeParam;
    const parsedBoardId = Number(value);

    if (Number.isFinite(parsedBoardId) === false) {
      return null;
    }

    return parsedBoardId;
  };

  const initSocket = (): void => {
    if (socketClient.value === null) {
      const socket = $socket.create('/board', {
        transports: ['websocket'],
        path: '/ws-board',
        query: { token: token.value },
      });
      $socket.addConnection('board', socket);
    }

    socketClient.value = $socket.getConnection('board');
    const boardId = resolveBoardId();

    if (boardId !== null) {
      socketClient.value.emit('join_board', { board: boardId });
    }
  };

  const wsErrorListener = (payload: { type: string }): void => {
    if (SOCKET_AUTH_ERRORS.includes(payload.type) === true) {
      message.error('Ошибка аутентификации общего доступа');
      socketClient.value?.close();
      return;
    }

    socketClient.value?.close();
    message.error('Непредвиденная ошибка общего доступа');
  };

  const listeners: Record<string, (...args: unknown[]) => void> = {
    connection_ready: (): void => {
      message.success('Установлено соединение для общего доступа');
    },
    error: (): void => {
      message.error('Ошибка соединения общего доступа');
    },
    ws_error: wsErrorListener,
    'task-created': (): void => {
      onTaskCreated.value?.();
    },
    'task-state-changed': (): void => {
      onTaskStateChanged.value?.();
    },
    'task-deleted': (): void => {
      onTaskDeleted.value?.();
    },
  };

  const initListeners = (): void => {
    if (socketClient.value === null) {
      return;
    }

    for (const key in listeners) {
      socketClient.value.on(key, listeners[key]);
    }
  };

  const detachListeners = (): void => {
    if (socketClient.value === null) {
      return;
    }

    for (const key in listeners) {
      socketClient.value.off(key, listeners[key]);
    }
  };

  onMounted((): void => {
    initSocket();
    initListeners();
  });

  onUnmounted((): void => {
    detachListeners();
    $socket.detachConnection('board');
    socketClient.value = null;
  });

  return {
    onTaskCreated,
    onTaskDeleted,
    onTaskStateChanged,
    socketClient,
  };
};
