import { getConnection } from 'typeorm';
import { Request } from "express";
import CrudController from "../../../Framework/Http/Controller/CrudController";
import BadRequest from "../../../Framework/Exceptions/BadRequest";
import Board from "../../Entity/Board";
import NotFound from "../../../Framework/Exceptions/NotFound";
import BoardsRepository from "../../Repository/BoardsRepository";
import BoardCreateRequest from "../FormRequest/Board/BoardCreateRequest";
import BoardUpdateRequest from "../FormRequest/Board/BoardUpdateRequest";
import UserBoards from "../../Entity/UserBoards";

export default class UserBoardsController extends CrudController
{
    private boardsRepository: BoardsRepository;

    public constructor() {
        super();
        this.boardsRepository = new BoardsRepository;
    }

    protected async list(req: Request): Promise<any[]>
    {
        return await this.boardsRepository.findByUserId(req['user'].id);
    }

    /**
     * @see CrudController
     */
    protected async create(req: Request): Promise<void>
    {
        const form: BoardCreateRequest = new BoardCreateRequest(req.body.formData);

        await form.validate();

        if (form.isNotValid()) {
            throw new BadRequest(form.getFirstError());
        }

        const userId: number = Number(req['user'].id);

        try {
            await getConnection().transaction(async transactionalEntityManager => {

                const board: Board = this.boardsRepository.createNew(form);

                const createdBoard: Board = await transactionalEntityManager.save(board);

                const assignment: UserBoards = this.boardsRepository.createUserToBoardAssignment(createdBoard.id, userId);

                await transactionalEntityManager.save(assignment);
            });
        } catch (err) {
            console.log(`Ошибка при создании доски: ${err}`, form);
            throw err;
        }
    }

    /**
     * @see CrudController
     */
    protected async update(id: number, req: Request, patch: boolean = false): Promise<void>
    {
        const board: Board = await this.findModel(id);

        const form: BoardUpdateRequest = new BoardUpdateRequest(req.body.formData);

        form.skipMissingProperties = patch;

        await form.validate();

        if (form.isNotValid()) {
            throw new BadRequest(form.getFirstError());
        }

        await this.boardsRepository.update(board, form);
    }

    protected async patch(id: number, req: Request): Promise<void>|never
    {
        await this.update(id, req, true);
    }

    /**
     * @see CrudController
     */
    protected async delete(id: number, req: Request): Promise<void|never>
    {
        await this.findModel(id);

        await this.boardsRepository.deleteById(id);
    }

    protected async findModel(id: number): Promise<Board | never>
    {
        const model: Board | undefined = await Board.findOne(id);

        if (model instanceof Board) {

            return model;
        }

        throw new NotFound('Группа не найдена');
    }
}