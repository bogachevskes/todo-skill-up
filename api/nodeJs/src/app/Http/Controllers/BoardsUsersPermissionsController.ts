import CrudController from "../../../Framework/Http/Controller/CrudController";
import {Request} from "express";
import BadRequest from "../../../Framework/Exceptions/BadRequest";
import NotFound from "../../../Framework/Exceptions/NotFound";
import BoardsRepository from "../../Repository/BoardsRepository";
import PermissionsRepository from "../../Repository/PermissionsRepository";

export default class BoardsUsersPermissionsController extends CrudController
{
    private boardsRepository: BoardsRepository;
    protected permissionsRepository: PermissionsRepository;

    public constructor() {
        super();
        this.boardsRepository = new BoardsRepository;
        this.permissionsRepository = new PermissionsRepository;
    }

    protected async list(req: Request): Promise<string[]>
    {
        if (await this.boardsRepository.userIsBoardOwner(Number(req.params.board_id), Number(req.params.user_id))) {

            return await this.permissionsRepository.getBoardsPermissions();
        }

        return await this.permissionsRepository.getBoardUserPermissions(
            Number(req.params.board_id),
            Number(req.params.user_id)
        );
    }

    protected async update(id: string, req: Request): Promise<void>
    {
        if (await this.boardsRepository.userIsBoardOwner(Number(req.params.board_id), Number(req.params.user_id))) {

            throw new BadRequest('Невозможно назначить дополнительное резрешение владельцу доски');
        }

        if (await this.permissionsRepository.isBoardPermissionExists(id) === false) {
            throw new NotFound('Разрешение доски не найдено');
        }

        const isPermissionAssigned = await this.permissionsRepository.userHasBoardPermission(
            req.params.id,
            Number(req.params.user_id),
            Number(req.params.board_id),
        )

        if (isPermissionAssigned === true) {
            return;
        }

        await this.permissionsRepository.assignBoardUserPermission(
            Number(req.params.board_id),
            Number(req.params.user_id),
            id,
        )
    }

    protected async delete(id: string, req: Request): Promise<void>
    {
        if (await this.boardsRepository.userIsBoardOwner(Number(req.params.board_id), Number(req.params.user_id))) {

            throw new BadRequest('Невозможно удалить дополнительное резрешение у владельца доски');
        }

        if (await this.permissionsRepository.isBoardPermissionExists(id) === false) {
            throw new NotFound('Разрешение доски не найдено');
        }

        await this.permissionsRepository.revokeBoardUserPermission(
            Number(req.params.board_id),
            Number(req.params.user_id),
            id
        );
    }
}