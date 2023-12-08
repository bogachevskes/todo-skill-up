import CrudController from "../../../Framework/Http/Controller/CrudController";
import {Request} from "express";
import TaskStatusRepository from "../../Repository/TaskStatusRepository";
import TaskStatus from "../../Entity/TaskStatus";
import TaskStatusRequest from "../FormRequest/TaskStatus/TaskStatusRequest";
import BadRequest from "../../../Framework/Exceptions/BadRequest";
import NotFound from "../../../Framework/Exceptions/NotFound";

export default class BoardsTasksStatusesController extends CrudController
{
    protected statusRepository: TaskStatusRepository;

    public constructor() {
        super();
        this.statusRepository = new TaskStatusRepository();
    }

    protected async list(req: Request): Promise<any[]>|never
    {
        return await this.statusRepository.getBoardStatuses(Number(req.params.board_id));
    }

    protected async create(req: Request): Promise<void|object>|never
    {
        const form = new TaskStatusRequest(req.body.formData);
        form.boardId = Number(req.params.board_id);

        await form.validate();

        if (form.isNotValid()) {
            throw new BadRequest(form.getFirstError());
        }

        await this.statusRepository.createNew(form)
            .save();
    }

    protected async update(id: number, req: Request): Promise<void>|never
    {
        const status: TaskStatus = await this.findModel(id);

        const form = new TaskStatusRequest(req.body.formData);
        form.boardId = Number(req.params.board_id);

        await form.validate();

        if (form.isNotValid()) {
            throw new BadRequest(form.getFirstError());
        }

        await this.statusRepository.update(status, form);
    }

    protected async delete(id: number, req: Request): Promise<void>
    {
        await this.findModel(id);

        await this.statusRepository.deleteById(id);
    }

    protected async findModel(id: number): Promise<TaskStatus | never>
    {
        const model: TaskStatus | undefined = await TaskStatus.findOne(id);

        if (model instanceof TaskStatus) {
            return model;
        }

        throw new NotFound('Статус задания не найден');
    }
}