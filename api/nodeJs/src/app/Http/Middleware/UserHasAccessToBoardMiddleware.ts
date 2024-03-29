import { Request } from 'express';
import Middleware from '../../../Framework/Http/Middleware/Middleware';

import BoardsRepository from '../../Repository/BoardsRepository';
import User from '../../Entity/User';
import Forbidden from "../../../Framework/Exceptions/Forbidden";

export default class UserHasAccessToBoardMiddleware extends Middleware
{
    public constructor(
        private boardIdAttribute: string = 'board_id',
        private userIdAttribute: string = 'user_id',
    ) {
        super();
    }

    /**
     * @see Middleware
     */
    protected async handle(req: Request): Promise<void>
    {
        const userId: number = Number(req.params[this.userIdAttribute]);

        const boardId: number = Number(req.params[this.boardIdAttribute]);

        if (await (new BoardsRepository).isUserExistsInBoard(boardId, userId) === false) {
            
            throw new Forbidden('Доступ к доске запрещен');
        }
    }
}
