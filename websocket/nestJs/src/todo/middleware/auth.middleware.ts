import { Socket } from 'socket.io';
import { NextFunction } from 'express';
import User from '../entities/user.entity';
import UsersService from '../services/users.service';
import InvalidAuthenticationException from '../exceptions/invalid_auth.exception';
import NotFoundException from '../exceptions/not_found.exception';
import ForbiddenException from '../exceptions/forbidden.exception';
import ErrorHandler from '../exceptions/error.handler';

export default class AuthMiddleware
{
    constructor(
        private readonly usersService: UsersService,
        private readonly errorHandler: ErrorHandler
    ) { }
    
    /**
     * @param  { Socket } socket 
     * @param  { NextFunction } next 
     * @return { Promise<void> }
     */
    public async handle(socket: Socket , next: NextFunction): Promise<void>
    {
        try {

            const jwt = require('jsonwebtoken');

            const token = socket.handshake.query['token'];

            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_WORD);

            if (decodedToken.userId === undefined) {
                throw new InvalidAuthenticationException(`Ошибка чтения токена аутентификации ${token}`);
            }

            const user = await this.usersService.findEntity(decodedToken.userId);

            if ((user instanceof User) === false) {
                throw new NotFoundException(`Пользователь #${decodedToken.userId} не найден`);
            }

            if (Boolean(user.status) === false) {
                throw new ForbiddenException(`Пользователь #${decodedToken.userId} заблокирован`);
            }

            socket.data.user = user;

            socket.emit('connection_ready');

            next();

        } catch (err) {

            this.errorHandler.handle(err, socket);
            
            next();
            
        }
    }
}