import Middleware from "../../../Framework/Http/Middleware/Middleware";
import {Request, Response} from "express";
import PermissionsRepository from "../../Repository/PermissionsRepository";
import Forbidden from "../../../Framework/Exceptions/Forbidden";
import BoardsRepository from "../../Repository/BoardsRepository";

export default class CurrentUserHasBoardPermission extends Middleware
{
    private permissionsRepository: PermissionsRepository;
    protected boardRepository: BoardsRepository;

    public constructor(
        private readonly permissionName: string,
        private readonly idParameterName: string = 'board_id',
    )
    {
        super();
        this.permissionName = permissionName;
        this.permissionsRepository = new PermissionsRepository();
        this.boardRepository = new BoardsRepository();
    }

    protected async handle(req: Request, res: Response): Promise<void>
    {
        const userId = Number(req['user'].id),
            boardId = Number(req.params[this.idParameterName]);

        if (await this.boardRepository.userIsBoardOwner(boardId, userId) === true) {
            return;
        }

        if (await this.permissionsRepository.userHasBoardPermission(this.permissionName, userId, boardId) === true) {
            return;
        }

        throw new Forbidden('Нет доступа');
    }

}