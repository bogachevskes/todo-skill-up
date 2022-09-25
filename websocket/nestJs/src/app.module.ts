import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TodoGateway } from './todo/todo.gateway';
import User from './todo/entities/user.entity';
import UsersService from './todo/services/users.service';
import ErrorHandler from './todo/exceptions/error.handler';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([User]),
        RedisModule.forRoot(
            require('../redisconfig')
        ),
    ],
    controllers: [],
    providers: [
        UsersService,
        TodoGateway,
        ErrorHandler,
    ],
})
export class AppModule {}
