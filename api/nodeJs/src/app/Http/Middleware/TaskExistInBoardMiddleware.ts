import Middleware from "../../../Framework/Http/Middleware/Middleware";
import {Request, Response} from "express";
import TaskRepository from "../../Repository/TaskRepository";
import Forbidden from "../../../Framework/Exceptions/Forbidden";
import NotFound from "../../../Framework/Exceptions/NotFound";

export default class TaskExistInBoardMiddleware extends Middleware
{
    private taskRepository: TaskRepository;

    public constructor() {
        super();
        this.taskRepository = new TaskRepository;
    }

    protected async handle(req: Request, res: Response): Promise<void>
    {
        if (await this.taskRepository.isTaskAssignedToBoard(Number(req.params.board_id), Number(req.params.id)) === false) {
            throw new NotFound('Задача не найдена');
        }
    }

}