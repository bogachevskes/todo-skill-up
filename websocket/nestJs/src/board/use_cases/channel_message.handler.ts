import { Server } from 'socket.io';
import BadRequestException from "../exceptions/bad_request.exception";

export default class ChannelMessageHandler
{
    private handlers: object = {};

    public constructor(private readonly server: Server)
    {
        this.defineHandlers();
    }

    private buildGroupRoomKey(key: string): string
    {
        return `board-room-${key}`;
    }

    private defineHandlers(): void
    {
        this.handlers['task-created'] = (message: string) => {
            const entity = JSON.parse(message);

            if ((typeof entity === 'object') === false) {
                throw new BadRequestException('Неожидаемый тип сущности задачи');
            }

            if (entity.boardId === undefined) {
                throw new BadRequestException('Не задан идентификатор доски задачи');
            }

            const roomName = this.buildGroupRoomKey(entity.boardId);

            this.server.to(roomName).emit('task-created', entity);
            console.log('task-created triggered to client room #' + roomName);
        }
        
        this.handlers['task-state-changed'] = (message: string) => {
            const entity = JSON.parse(message);

            if ((typeof entity === 'object') === false) {
                throw new BadRequestException('Неожидаемый тип сущности задачи');
            }

            if (entity.boardId === undefined) {
                throw new BadRequestException('Не задан идентификатор доски задачи');
            }

            const roomName = this.buildGroupRoomKey(entity.boardId);

            this.server.to(roomName).emit('task-state-changed', entity);
            console.log('task-state-changed triggered to client');
        };

        this.handlers['task-deleted'] = (message: string) => {

            const entity = JSON.parse(message);

            if ((typeof entity === 'object') === false) {
                throw new BadRequestException('Неожидаемый тип сущности задачи');
            }

            if (entity.boardId === undefined) {
                throw new BadRequestException('Не задан идентификатор доски задачи');
            }

            const roomName = this.buildGroupRoomKey(entity.boardId);

            this.server.to(roomName).emit('task-deleted', entity);
            console.log('task-deleted triggered to client room #' + roomName);
        }
    }

    public handle(channel: string, message: string): void
    {
        if ((channel in this.handlers) === false) {
            throw new Error('Обработчик не определен');
        }

        this.handlers[channel](message);
    }
}