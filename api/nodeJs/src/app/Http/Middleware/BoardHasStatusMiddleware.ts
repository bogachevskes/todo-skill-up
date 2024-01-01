import { Request } from 'express';
import Middleware from '../../../Framework/Http/Middleware/Middleware';
import NotFound from "../../../Framework/Exceptions/NotFound";
import TaskStatusRepository from "../../Repository/TaskStatusRepository";

export default class BoardHasStatusMiddleware extends Middleware
{
    protected taskStatusRepository: TaskStatusRepository;

    public constructor() {
        super();
        this.taskStatusRepository = new TaskStatusRepository;
    }

    /**
     * @see Middleware
     */
    protected async handle(req: Request): Promise<void>
    {
        const boardId = Number(req.params.board_id);
        const statusId = Number(req.params.id);

        if (await this.taskStatusRepository.isExistInBoard(statusId, boardId) === false) {
            throw new NotFound('Статус не найден в доске задач');
        }
    }
}
