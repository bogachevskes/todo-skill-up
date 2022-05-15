import { Module } from '@nestjs/common';
import { TodoGateway } from './todo/todo.gateway';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [],
    providers: [TodoGateway],
})
export class AppModule {}
