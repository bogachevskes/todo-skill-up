import { Request } from 'express';
import Middleware from '../../../Framework/Http/Middleware/Middleware';

import BoardsRepository from '../../Repository/BoardsRepository';
import User from '../../Entity/User';
import Forbidden from "../../../Framework/Exceptions/Forbidden";

export default class UserHasAccessToBoardMiddleware extends Middleware
{
    /**
     * @see Middleware
     */
    protected async handle(req: Request): Promise<void>
    {
        const user: User = req['user'];

        const boardId = req.params.board_id || req.params.id

        if (await (new BoardsRepository).isUserExistsInBoard(Number(boardId), Number(user.id)) === false) {
            
            throw new Forbidden('Доступ к группе запрещен');
        }
    }
}
