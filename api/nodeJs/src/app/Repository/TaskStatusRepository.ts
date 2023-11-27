import { SelectQueryBuilder } from 'typeorm';
import TaskStatus from '../Entity/TaskStatus';

export default class TaskStatusRepository
{
    protected getQueryBuilder(): SelectQueryBuilder<TaskStatus>
    {
        return TaskStatus.createQueryBuilder('ts');
    }

    public async getBoardStatuses(): Promise<TaskStatus[]>
    {
        // TODO: дописать выборку статусов для группу по итогу создания статусов групп
        const query = this.getQueryBuilder()
            .select([
                'ts.id as id',
                'ts.name as name',
                'ts.created_at as created_at',
            ]);

        return query.getRawMany();
    }

}
