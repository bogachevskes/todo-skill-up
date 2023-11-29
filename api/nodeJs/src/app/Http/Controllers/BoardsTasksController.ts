import { Request } from 'express';
import CrudController from '../../../Framework/Http/Controller/CrudController';
import NotFound from '../../../Framework/Exceptions/NotFound';
import BadRequest from '../../../Framework/Exceptions/BadRequest';
import Task from '../../Entity/Task';
import TaskRepository from '../../Repository/TaskRepository';
import TaskStatusRepository from "../../Repository/TaskStatusRepository";
import TaskStatus from "../../Entity/TaskStatus";
import TaskRequest from "../FormRequest/Task/TaskRequest";
import RedisProducer from "../../../Framework/Producers/RedisProducer";

export default class BoardsTasksController extends CrudController
{
    protected statusRepository: TaskStatusRepository;
    protected taskRepository: TaskRepository;
    protected producer: RedisProducer;

    public constructor() {
        super();
        this.statusRepository = new TaskStatusRepository();
        this.taskRepository = new TaskRepository();
        this.producer = new RedisProducer();
    }

    /**
     * @see CrudController
     */
    protected async list(req: Request): Promise<object[]>
    {
        const statuses: TaskStatus[] = await this.statusRepository.getBoardStatuses(Number(req.params.board_id));

        const result: object[] = [];

        for (const status of statuses) {
            result.push({
                status,
                tasks: await this.taskRepository.getBoardTasksByStatus(
                    Number(req.params.board_id),
                    Number(status.id)
                )
            });
        }

        return result;
    }

    /**
     * @see CrudController
     */
    protected async create(req: Request): Promise<void>
    {
        const form: TaskRequest = new TaskRequest(req.body.formData);

        form.boardId = Number(req.params.board_id);

        await form.validate();

        if (form.isNotValid()) {
            throw new BadRequest(form.getFirstError());
        }

        const task: Task = await this.taskRepository.createNew(form);

        this.producer.send('todo-created', task);
    }

    /**
     * @see CrudController
     */
    protected async update(id: number, req: Request, patch: boolean = false): Promise<void>
    {
        const task: Task = await this.findModel(id);

        const form: TaskRequest = new TaskRequest(req.body.formData);

        form.boardId = Number(req.params.board_id);

        form.skipMissingProperties = patch;

        await form.validate();

        if (form.isNotValid()) {
            throw new BadRequest(form.getFirstError());
        }

        const updatedTask: Task = await this.taskRepository.update(task, form);

        this.producer.send('todo-state-changed', updatedTask);
    }

    protected async patch(id: number, req: Request): Promise<void>|never
    {
        await this.update(id, req, true);
    }

    /**
     * @see CrudController
     */
    protected async delete(id: number, req: Request): Promise<void>
    {
        const task: Task = await this.findModel(id);

        await this.taskRepository.deleteById(id);

        this.producer.send('todo-deleted', task);
    }

    protected async findModel(id: number): Promise<Task | never>
    {
        const model: Task | undefined = await Task.findOne(id);

        if (model instanceof Task) {
            return model;
        }

        throw new NotFound('Задание не найдено');
    }
}
