import { Request } from 'express';
import CrudController from '../../../Framework/Http/Controller/CrudController';
import BadRequest from '../../../Framework/Exceptions/BadRequest';
import CommandContext from '../../../Framework/Base/CommandContext';
import BoardUserCreate from '../../Commands/BoardUserCreate';
import UserRepository from "../../Repository/UserRepository";
import BoardUsersRequest from "../FormRequest/BoardUsers/BoardUsersRequest";
import BoardsRepository from "../../Repository/BoardsRepository";
import NotFound from "../../../Framework/Exceptions/NotFound";
import PermissionsRepository from "../../Repository/PermissionsRepository";
import Db from '../../Components/Db';
import { Knex } from 'knex';
import Transaction = Knex.Transaction;

export default class BoardsUsersController extends CrudController
{
    protected userRepository: UserRepository;
    protected boardRepository: BoardsRepository;
    protected permissionsRepository: PermissionsRepository;

    public constructor() {
        super();
        this.userRepository = new UserRepository;
        this.boardRepository = new BoardsRepository;
        this.permissionsRepository = new PermissionsRepository;
    }

    /**
     * @see CrudController
     */
    protected async list(req: Request): Promise<object[]>
    {
        return await this.boardRepository.getBoardUsers(Number(req.params.board_id));
    }

    /**
     * @see CrudController
     */
    protected async create(req: Request): Promise<void>
    {
        const form: BoardUsersRequest = new BoardUsersRequest(req.body.formData);

        form.board_id = Number(req.params.board_id);

        await form.validate();

        if (form.isNotValid()) {
            throw new BadRequest(form.getFirstError());
        }

        if (await this.boardRepository.isBoardExists(form.board_id) === false) {
            throw new NotFound('Доска не найдена');
        }

        const
            context: CommandContext = new CommandContext,
            cmd: BoardUserCreate = new BoardUserCreate(
                this.userRepository,
                this.boardRepository,
            );

        context.walk(req.body.formData);
        context.set('board_id', form.board_id);

        await cmd.execute(context);

        if (context.get('warnings').users.not_exist.length > 0) {
            return context.get('warnings');
        }
    }

    /**
     * @see CrudController
     */
    protected async delete(id: number, req: Request): Promise<void>
    {
        await Db.transaction(async (trx: Transaction) => {
            try {

                await this.boardRepository.revokeUserFromBoard(Number(req.params.board_id), id, trx);
                await this.permissionsRepository.revokeAllBoardUserPermission(Number(req.params.board_id), id, trx);

                await trx.commit();

            } catch (err) {
                await trx.rollback();
                throw err;
            }
        });
    }
}