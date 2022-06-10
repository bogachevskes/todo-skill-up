import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import AuthMiddleware from './middleware/auth.middleware';
import UsersService from './services/users.service';
import ErrorHandler from './exceptions/error.handler';

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
        @InjectRedis() private readonly redis: Redis,
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

        this.redis.subscribe('change-todo-state');

        this.redis.on('message', (channel, message) => {
            
            if (channel === 'change-todo-state') {
                const model = JSON.parse(message);

                if (typeof model === 'object') {
                    this.server.emit('todo-state-changed', model);
                    console.log('todo-state-changed triggered to client');
                }
            }
        });
        
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
}
