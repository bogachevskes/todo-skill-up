import { Module } from '@nestjs/common';
import { TodoGateway } from './todo/todo.gateway';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(),
    ],
    controllers: [],
    providers: [TodoGateway],
})
export class AppModule {}
