import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import AuthMiddleware from '../common/middleware/gateway/auth.middleware';

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
    
    /**
     * @param  { Server } server
     * @return void
     */
    afterInit(server: Server): void
    {
        this.server.use((new AuthMiddleware).handle);

        this.logger.log(`Initialized on port: ${process.env.APP_PORT}`);
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
        setInterval(() => client.emit('check', 'connection ready'), 10000);
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
