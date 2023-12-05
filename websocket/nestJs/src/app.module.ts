import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { BoardGateway } from './board/board.gateway';
import User from './board/entities/user.entity';
import UsersService from './board/services/users.service';
import ErrorHandler from './board/exceptions/error.handler';

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
        BoardGateway,
        ErrorHandler,
    ],
})
export class AppModule {}
