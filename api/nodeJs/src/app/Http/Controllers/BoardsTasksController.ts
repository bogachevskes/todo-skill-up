import { Request } from 'express';
import CrudController from '../../../Framework/Http/Controller/CrudController';
import NotFound from '../../../Framework/Exceptions/NotFound';
import BadRequest from '../../../Framework/Exceptions/BadRequest';
import Task from '../../Entity/Task';
import TaskRepository from '../../Repository/TaskRepository';
import RedisConnection from '../../Services/RedisConnection';
import TaskStatusRepository from "../../Repository/TaskStatusRepository";
import TaskStatus from "../../Entity/TaskStatus";
import TaskCreateRequest from "../FormRequest/Task/TaskCreateRequest";
import TaskUpdateRequest from "../FormRequest/Task/TaskUpdateRequest";

export default class BoardsTasksController extends CrudController
{
    protected statusRepository: TaskStatusRepository;
    protected taskRepository: TaskRepository;

    public constructor() {
        super();
        this.statusRepository = new TaskStatusRepository();
        this.taskRepository = new TaskRepository();
    }

    /**
     * @see CrudController
     */
    protected async list(req: Request): Promise<object[]>
    {
        const statuses: TaskStatus[] = await this.statusRepository.getBoardStatuses();

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
        const form: TaskCreateRequest = new TaskCreateRequest(req.body.formData);

        form.userId = Number(req['user'].id);
        form.todoGroupId = Number(req.params.board_id);

        await form.validate();

        if (form.isNotValid()) {
            throw new BadRequest(form.getFirstError());
        }

        const task: Task = await this.taskRepository.createNew(form);

        const msg: string = JSON.stringify(task);

        // вынести в сервис

        RedisConnection.getClient()
            .publish('todo-created', msg);
    }

    /**
     * @see CrudController
     */
    protected async update(id: number, req: Request, patch: boolean = false): Promise<void>
    {
        const task: Task = await this.findModel(id);

        const form: TaskUpdateRequest = new TaskUpdateRequest(req.body.formData);

        form.userId = Number(req['user'].id);
        form.todoGroupId = Number(req.params.board_id);

        form.skipMissingProperties = patch;

        await form.validate();

        if (form.isNotValid()) {
            throw new BadRequest(form.getFirstError());
        }

        await this.taskRepository.update(task, form);

        const msg = JSON.stringify(task);

        // TODO: вынести в сервис

        RedisConnection.getClient()
            .publish('todo-state-changed', msg);
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

        const msg = JSON.stringify(task);

        // TODO: вынести в сервис

        RedisConnection.getClient()
            .publish('todo-deleted', msg);
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
