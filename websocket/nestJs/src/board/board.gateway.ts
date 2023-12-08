import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import AuthMiddleware from './middleware/auth.middleware';
import UsersService from './services/users.service';
import ErrorHandler from './exceptions/error.handler';
import ChannelMessageHandler from './use_cases/channel_message.handler';
import BadRequestException from "./exceptions/bad_request.exception";

@WebSocketGateway({
    path: '/ws-board',
    namespace: '/board',
    transports: ['websocket'],
    cors: {
        origin: false,
    },
})
export class BoardGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server: Server;

    private logger: Logger = new Logger('AppGateway');

    constructor(
        @InjectRedis('subscriber') private readonly redis: Redis,
        private readonly usersService: UsersService,
        private readonly errorHandler: ErrorHandler
    ) {}

    public async afterInit(server: Server): Promise<void>
    {
        this.server.use(await (new AuthMiddleware(this.usersService, this.errorHandler)).handle.bind(this));

        this.logger.log(`Initialized on port: ${process.env.APP_PORT}`);

        this.redis.subscribe(
            'task-created',
            'task-state-changed',
            'task-deleted'
        );

        const messageHandler = new ChannelMessageHandler(server);

        this.redis.on('message', (channel, message) => {
            messageHandler.handle(channel, message);
        });
        
    }

    private buildGroupRoomKey(key: string): string
    {
        return `board-room-${key}`;
    }

    public handleDisconnect(client: Socket): void
    {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    public handleConnection(client: Socket): void
    {
        this.logger.log(`Client connected: ${client.id}`);
    }

    @SubscribeMessage('message')
    public handleMessage(_client: Socket, payload: object): void
    {
        this.server.emit('check', `got message: ${JSON.stringify(payload)}`);
    }

    @SubscribeMessage('join_board')
    public handleGroupJoin(client: Socket, payload: object): void
    {
        if (payload['board'] === undefined) {

            throw new BadRequestException('Не указан идентификатор доски задач');
        }

        const roomName = this.buildGroupRoomKey(payload['board']);

        client.join(roomName);

        console.log(`Client connected to room id: ${roomName}`);
    }

    @SubscribeMessage('leave_board')
    public handleGroupLeave(client: Socket, payload: object): void
    {
        if (payload['board'] === undefined) {
            
            return;
        }

        const roomName = this.buildGroupRoomKey(payload['board']);

        client.leave(roomName);

        console.log(`Client left room id: ${roomName}`);
    }
}
