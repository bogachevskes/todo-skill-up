import { SelectQueryBuilder } from 'typeorm';
import TodoAccessGroup from '../Entity/TodoAccessGroup';

export default class TodoAccessGroupRepository
{
    /**
     * @return SelectQueryBuilder<TodoAccessGroup>
     */
    protected static getQueryBuilder(): SelectQueryBuilder<TodoAccessGroup>
    {
        return TodoAccessGroup.createQueryBuilder('todo_access_group');
    }

    /**
     * @param  number id
     * @return Promise<boolean>
     */
    public static async isGroupExists(id: number): Promise<boolean>
    {
        const result = await this.getQueryBuilder()
            .select('COUNT(id) as exist')
            .where('id = :id', { id })
            .getRawOne();

        return Boolean(result.exist);
    }
}