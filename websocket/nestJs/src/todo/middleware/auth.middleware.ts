import { Socket } from 'socket.io';
import { NextFunction } from 'express';
import User from '../../users/user.entity';
import UsersService from '../services/users.service';

export default class AuthMiddleware
{
    constructor(private readonly usersService: UsersService) { }
    
    /**
     * @param  { Socket } socket 
     * @param  { NextFunction } next 
     * @return { Promise<void> }
     */
    public async handle(socket: Socket , next: NextFunction): Promise<void>
    {
        try {
            if (socket.handshake.query['token'] === undefined) {
                throw new Error('Ошибка авторизации');
            }

            const jwt = require('jsonwebtoken');

            const decodedToken = jwt.verify(socket.handshake.query['token'], process.env.TOKEN_SECRET_WORD);

            if (decodedToken.userId === undefined) {
                throw new Error('Аутентификация не выполнена');
            }

            const user = await this.usersService.findEntity(decodedToken.userId);

            if ((user instanceof User) === false) {
                throw new Error('Пользователь не найден');
            }

            if (Boolean(user.status) === false) {
                throw new Error('Пользователь заблокирован');
            }

            socket.data.user = user;

            socket.emit('connection_ready');

            next();

        } catch (err) {
            // handle error
            console.log(err);
        }
    }
}