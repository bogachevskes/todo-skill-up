import { Module } from '@nestjs/common';
import { TodoGateway } from './todo/todo.gateway';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(),
        RedisModule.forRoot(
            require('../redisconfig')
        ),
    ],
    controllers: [],
    providers: [
        TodoGateway,
    ],
})
export class AppModule {}
