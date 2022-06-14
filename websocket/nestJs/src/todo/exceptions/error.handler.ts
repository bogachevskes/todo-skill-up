import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import WebsocketException from './websocket.exception';

@Injectable()
export default class ErrorHandler
{
    public handle(err: Error, socket: Socket): void
    {
        const beforeErrorActions = {
            InvalidAuthenticationException: function (err) {
                console.log(`Неудачная попытка аутентификации. ${err.message}`);
            },
            ForbiddenException: function (err) {
                console.log(`Неудачная попытка аутентификации. ${err.message}`);
            },
        };

        if (beforeErrorActions[err.constructor.name] instanceof Function) {
            beforeErrorActions[err.constructor.name](err);
        }

        let message: String = err.message;

        if ((err instanceof WebsocketException) === false) {
            console.log(`Непредвиденная ошибка. ${err.message}`);

            message = 'Ошибка сервера';
        }

        socket.emit('ws_error', {type: err.constructor.name, message});
    }
}