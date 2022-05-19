import { Socket } from 'socket.io';
import { NextFunction } from 'express';
import User from '../../../users/user.entity';

export default class AuthMiddleware
{
    /**
     * @param  { Socket } socket 
     * @param  { NextFunction } next 
     * @return { Promise<void> }
     */
    public handle(socket: Socket , next: NextFunction): void
    {
        User.findOne({ where: { id: 1 } })
            .then((user) => {
                console.log(user);
                next();
            });
    }
}