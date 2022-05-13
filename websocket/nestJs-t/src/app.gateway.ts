import { SubscribeMessage, WebSocketGateway, OnGatewayInit } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@WebSocketGateway(Number(process.env.APP_WS_PORT))
export class AppGateway implements  OnGatewayInit {
    
    private logger: Logger = new Logger('AppGateway');
    
    afterInit(server: any) {
        this.logger.log('Initialized!', process.env.APP_WS_PORT);
    }
    
    @SubscribeMessage('message')
    handleMessage(client: any, payload: any): string {
        return 'Hello world!';
    }
}
