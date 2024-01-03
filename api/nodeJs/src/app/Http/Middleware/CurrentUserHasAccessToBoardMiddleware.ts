import { Request } from 'express';
import Middleware from '../../../Framework/Http/Middleware/Middleware';

import BoardsRepository from '../../Repository/BoardsRepository';
import User from '../../Entity/User';
import Forbidden from "../../../Framework/Exceptions/Forbidden";

export default class CurrentUserHasAccessToBoardMiddleware extends Middleware
{
    public constructor(private boardIdAttribute: string = 'board_id')
    {
        super();
    }

    /**
     * @see Middleware
     */
    protected async handle(req: Request): Promise<void>
    {
        const user: User = req['user'];

        const boardId = req.params[this.boardIdAttribute];

        if (await (new BoardsRepository).isUserExistsInBoard(Number(boardId), Number(user.id)) === false) {
            
            throw new Forbidden('Доступ к доске запрещен');
        }
    }
}
