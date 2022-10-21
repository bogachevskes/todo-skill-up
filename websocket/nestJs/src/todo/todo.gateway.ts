import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import AuthMiddleware from './middleware/auth.middleware';
import UsersService from './services/users.service';
import ErrorHandler from './exceptions/error.handler';
import ChannelMessageHandler from './use_cases/channel_message.handler';

@WebSocketGateway({
    path: '/todo',
    namespace: '/todo',
    transports: ['websocket'],
    cors: {
        origin: process.env.ORIGIN_URL,
    },
})
export class TodoGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    /**
     * @var { Server }
     */
    @WebSocketServer() server: Server;

    /**
     * @var { Logger }
     */
    private logger: Logger = new Logger('AppGateway');

    constructor(
        @InjectRedis('subscriber') private readonly redis: Redis,
        private readonly usersService: UsersService,
        private readonly errorHandler: ErrorHandler
    ) {}
    
    /**
     * @param  { Server } server
     * @return void
     */
    async afterInit(server: Server): Promise<void>
    {
        this.server.use(await (new AuthMiddleware(this.usersService, this.errorHandler)).handle.bind(this));

        this.logger.log(`Initialized on port: ${process.env.APP_PORT}`);

        this.redis.subscribe(
            'todo-created',
            'todo-state-changed',
            'todo-deleted'
        );

        const messageHandler = new ChannelMessageHandler(server);

        this.redis.on('message', (channel, message) => {
            messageHandler.handle(channel, message);
        });
        
    }

    /**
     * @param  { string } key 
     * @return { string }
     */
    private buildAccessGroupRoomKey(key: string): string
    {
        return `access-group-room-${key}`;
    }

    /**
     * @param  { Socket } client
     * @return void
     */
    handleDisconnect(client: Socket): void
    {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    /**
     * @param  { Socket } client 
     * @return void
     */
    handleConnection(client: Socket): void
    {
        this.logger.log(`Client connected: ${client.id}`);
    }
    
    /**
     * @param  { Socket } client 
     * @param  { object } payload 
     * @returns void
     */
    @SubscribeMessage('message')
    handleMessage(_client: Socket, payload: object): void
    {
        this.server.emit('check', `got message: ${JSON.stringify(payload)}`);
    }

    @SubscribeMessage('join_access_group')
    handleAccessGroupJoin(client: Socket, payload: object): void
    {
        if (payload['group'] === undefined) {
            
            return;
        }

        const roomName = this.buildAccessGroupRoomKey(payload['group']);

        client.join(roomName);

        console.log(`Client connected to room id: ${roomName}`);
    }

    @SubscribeMessage('leave_access_group')
    handleAccessGroupLeave(client: Socket, payload: object): void
    {
        if (payload['group'] === undefined) {
            
            return;
        }

        const roomName = this.buildAccessGroupRoomKey(payload['group']);

        client.leave(roomName);

        console.log(`Client left room id: ${roomName}`);
    }
}
