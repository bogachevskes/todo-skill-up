import { Request } from 'express';
import Middleware from '../../../Framework/Http/Middleware/Middleware';

import User from '../../Entity/User';
import Forbidden from "../../../Framework/Exceptions/Forbidden";

export default class IsCurrentUserMiddleware extends Middleware
{
    /**
     * @see Middleware
     */
    protected async handle(req: Request): Promise<void>
    {
        const user: User = req['user'];

        if (Number(user.id) !== Number(req.params.id)) {
            throw new Forbidden('Доступ запрещен');
        }
    }
}
