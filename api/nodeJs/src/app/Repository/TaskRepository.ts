import { SelectQueryBuilder } from 'typeorm';
import Task from '../Entity/Task';
import TaskRequest from "../Http/FormRequest/Task/TaskRequest";

export default class TaskRepository
{
    protected getQueryBuilder(): SelectQueryBuilder<Task>
    {
        return Task.createQueryBuilder('t');
    }

    public async getBoardTasksByStatus(boardId: Number, statusId: Number): Promise<Task[]>
    {
        const query = this.getQueryBuilder()
            .select([
                't.id as id',
                't.status_id as status_id',
                't.board_id as board_id',
                't.name as name',
                't.description as description',
                't.planned_completion_at as planned_completion_at',
                't.created_at as created_at'
            ])
            .where({boardId, statusId});

        return query.getRawMany();
    }

    protected loadModel(model: Task, data: object): Task
    {
        for(const key in data) {
            model[key] = data[key];
        }

        return model;
    }

    public async createNew(data: TaskRequest): Promise<Task>
    {
        const model = this.loadModel(new Task, data);

        await model.save();

        return model;
    }

    public async deleteById(id: number): Promise<boolean>
    {
        await this.getQueryBuilder()
            .where('id = :id', { id })
            .delete()
            .execute();

        return true;
    }

    public async update(item: Task, attributes: object): Promise<Task>
    {
        const model = this.loadModel(item, attributes);
        
        await model.save();

        return model;
    }
}
