import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TodoGateway } from './todo/todo.gateway';
import User from './users/user.entity';
import UsersService from './todo/services/users.service';

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
    ],
})
export class AppModule {}
