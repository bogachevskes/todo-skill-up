import { Server } from 'socket.io';

export default class ChannelMessageHandler
{
    /**
     * @var { object }
     */
    private handlers: object = {};

    public constructor(private readonly server: Server)
    {
        this.defineHandlers();
    }

    /**
     * @param  { string } key 
     * @return { string }
     */
    private buildGroupRoomKey(key: string): string
    {
        return `access-group-room-${key}`;
    }

    /**
     * @return { void }
     */
    private defineHandlers(): void
    {
        this.handlers['todo-created'] = (message: string) => {
            const model = JSON.parse(message);

            if ((typeof model === 'object') === false) {
                return;
            }

            if (model.todoGroupId === undefined) {
                return;
            }

            const roomName = this.buildGroupRoomKey(model.todoGroupId);

            this.server.to(roomName).emit('todo-created', model);
            console.log('todo-created triggered to client room #' + roomName);
        }
        
        this.handlers['todo-state-changed'] = (message: string) => {
            const model = JSON.parse(message);

            if ((typeof model === 'object') === false) {
                return;
            }

            if (model.todoGroupId === undefined) {
                return;
            }

            const roomName = this.buildGroupRoomKey(model.todoGroupId);

            this.server.to(roomName).emit('todo-state-changed', model);
            console.log('todo-state-changed triggered to client');
        };

        this.handlers['todo-deleted'] = (message: string) => {

            const model = JSON.parse(message);

            if ((typeof model === 'object') === false) {
                return;
            }

            if (model.todoGroupId === undefined) {
                return;
            }

            const roomName = this.buildGroupRoomKey(model.todoGroupId);

            this.server.to(roomName).emit('todo-deleted', model);
            console.log('todo-deleted triggered to client room #' + roomName);
        }
    }

    /**
     * 
     * @param  { string } channel
     * @param  { string } message
     * @return { void }
     */
    public handle(channel: string, message: string): void
    {
        if ((channel in this.handlers) === false) {
            throw new Error('Обработчик не определен');
        }

        this.handlers[channel](message);
    }
}