import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(Number(process.env.APP_PORT), {transports: ["websocket"]})
export class AppGateway implements  OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
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
     * @param { Server } server
     * @return void
     */
    afterInit(_server: Server): void
    {
        this.logger.log(`Initialized on port: ${process.env.APP_PORT}`);
    }

    /**
     * 
     * @param { Socket } client
     */
    handleDisconnect(client: Socket)
    {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    /**
     * 
     * @param { Socket } client 
     * @param args 
     */
    handleConnection(client: Socket, ..._args: any[])
    {
        setInterval(() => client.emit('check', 'connection ready'), 10000);
    }
    
    /**
     * @param { Socket } client 
     * @param { object } payload 
     * @returns string
     */
    @SubscribeMessage('message')
    handleMessage(_client: Socket, payload: object): void
    {
        console.log(payload);
        
        this.server.emit('check', `got message: ${JSON.stringify(payload)}`)
    }
}
