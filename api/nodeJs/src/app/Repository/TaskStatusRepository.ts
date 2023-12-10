import { SelectQueryBuilder } from 'typeorm';
import TaskStatus from '../Entity/TaskStatus';

export default class TaskStatusRepository
{
    protected getQueryBuilder(): SelectQueryBuilder<TaskStatus>
    {
        return TaskStatus.createQueryBuilder('ts');
    }

    public async getBoardStatuses(boardId: number): Promise<any[]>
    {
        const query = this.getQueryBuilder()
            .select([
                'ts.id as id',
                'ts.board_id as boardId',
                'ts.name as name',
                'ts.created_at as createdAt',
            ])
            .where('ts.board_id = :boardId', {boardId});

        return query.getRawMany();
    }

    protected loadModel(model: TaskStatus, data: object): TaskStatus
    {
        for (const key in data) {
            model[key] = data[key];
        }

        return model;
    }

    public createNew(attributes: object): TaskStatus
    {
        return this.loadModel(new TaskStatus(), attributes);
    }

    public async update(item: TaskStatus, attributes: object): Promise<TaskStatus>
    {
        const model: TaskStatus = this.loadModel(item, attributes);

        await model.save();

        return model;
    }

    public async deleteById(id: number): Promise<void>
    {
        const query = this.getQueryBuilder()
            .where('id = :id', { id })
            .delete();

        await query.execute();
    }

    public async isExistInBoard(statusId: Number, boardId: Number): Promise<boolean>
    {
        const query = this.getQueryBuilder()
            .select('COUNT(ts.id) as exist')
            .where('ts.id = :statusId AND ts.board_id = :boardId', {statusId, boardId});

        const result = await query.getRawOne();

        return Boolean(Number(result['exist']));
    }

}
