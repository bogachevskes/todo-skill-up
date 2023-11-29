import { Request } from 'express';
import Middleware from '../../../Framework/Http/Middleware/Middleware';
import NotFound from "../../../Framework/Exceptions/NotFound";
import TaskStatusRepository from "../../Repository/TaskStatusRepository";

export default class TaskStatusExistInGroupMiddleware extends Middleware
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
        if (req.body.formData.hasOwnProperty('statusId') === false) {
            return;
        }

        const boardId = Number(req.params.board_id);
        const statusId = Number(req.body.formData.statusId);

        console.log(await this.taskStatusRepository.isExistInGroup(statusId, boardId));

        if (await this.taskStatusRepository.isExistInGroup(statusId, boardId) === false) {
            throw new NotFound('Статус не найден в доске задач');
        }
    }
}
