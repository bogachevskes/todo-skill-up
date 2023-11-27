import { Request } from 'express';
import CrudController from '../../../Framework/Http/Controller/CrudController';
import BadRequest from '../../../Framework/Exceptions/BadRequest';
import CommandContext from '../../../Framework/Base/CommandContext';
import BoardUserCreate from '../../Commands/BoardUserCreate';
import UserRepository from "../../Repository/UserRepository";
import BoardUsersCreateRequest from "../FormRequest/BoardUsers/BoardUsersCreateRequest";
import BoardsRepository from "../../Repository/BoardsRepository";
import NotFound from "../../../Framework/Exceptions/NotFound";

export default class BoardsUsersController extends CrudController
{
    protected userRepository: UserRepository;
    protected boardRepository: BoardsRepository;

    public constructor() {
        super();
        this.userRepository = new UserRepository;
        this.boardRepository = new BoardsRepository;
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
        const form: BoardUsersCreateRequest = new BoardUsersCreateRequest(req.body.formData);

        form.todo_group_id = Number(req.params.board_id);

        await form.validate();

        if (form.isNotValid()) {
            throw new BadRequest(form.getFirstError());
        }

        if (await this.boardRepository.isGroupExists(form.todo_group_id) === false) {
            throw new NotFound('Группа не существует');
        }

        const
            context: CommandContext = new CommandContext,
            cmd: BoardUserCreate = new BoardUserCreate(
                this.userRepository,
                this.boardRepository,
            );

        context.walk(req.body.formData);
        context.set('todo_group_id', form.todo_group_id);

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
        await this.boardRepository.revokeUserFromBoard(Number(req.params.board_id), id);
    }
}