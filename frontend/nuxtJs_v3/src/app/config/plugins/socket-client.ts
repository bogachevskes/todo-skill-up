import { io, type Socket } from 'socket.io-client';

import { defineNuxtPlugin, useRuntimeConfig } from '#imports';

type SocketConnections = Record<string, Socket>;

type SocketFactory = {
  addConnection: (key: string, socket: Socket) => void;
  connections: SocketConnections;
  create: (namespace?: string, options?: object) => Socket;
  detachConnection: (key: string) => void;
  getConnection: (key: string) => Socket;
  hasConnection: (key: string) => boolean;
  io: typeof io;
};

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const socket: SocketFactory = {
    connections: {},
    io,

    create(namespace = '', options = {}): Socket {
      return this.io(`${config.public.webSocketUrl}${namespace}`, options);
    },

    getConnection(key: string): Socket {
      return this.connections[key];
    },

    hasConnection(key: string): boolean {
      return this.connections[key] !== undefined;
    },

    addConnection(key: string, socketClient: Socket): void {
      this.connections[key] = socketClient;
    },

    detachConnection(key: string): void {
      if (this.connections[key] === undefined) {
        return;
      }

      this.connections[key].disconnect();
      delete this.connections[key];
    },
  };

  return {
    provide: {
      socket,
    },
  };
});
