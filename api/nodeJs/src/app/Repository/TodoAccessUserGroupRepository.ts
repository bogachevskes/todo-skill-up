import { SelectQueryBuilder } from 'typeorm';
import TodoAccessGroup from '../Entity/TodoAccessGroup';
import TodoAccessUserGroup from '../Entity/TodoAccessUserGroup';
import TodoAccessGroupCreateRequest from '../FormRequest/TodoAccessGroup/TodoAccessGroupCreateRequest';

export default class TodoAccessUserGroupRepository
{
    /**
     * @return SelectQueryBuilder<TodoAccessGroup>
     */
    protected static getQueryBuilder(): SelectQueryBuilder<TodoAccessUserGroup>
    {
        return TodoAccessUserGroup.createQueryBuilder('taug');
    }

    /**
     * @param  id number
     * @return Promise<boolean>
     */
    public static async deleteById(id: number): Promise<boolean>
    {
        await this.getQueryBuilder()
            .where('id = :id', { id })
            .delete()
            .execute();

        return true;
    }

    /**
     * @param  userId 
     * @param  id 
     * @returns Promise<TodoAccessUserGroup | undefined>
     */
    public static async findOneByUserId(userId: number, id: number): Promise<TodoAccessUserGroup | undefined>
    {
        const query = this.getQueryBuilder()
            .select(['taug.id'])
            .leftJoin('taug.todoAccessGroup', 'tag')
            .where('taug.id = :id AND tag.userId = :userId', { id, userId });

        return await query.getOne();
    }

    /**
     * @param groupId number
     * @param userId number
     * @return Promise<boolean>
     */
    public static async isUserExistsInGroup(groupId: number, userId: number): Promise<boolean>
    {
        const query = this.getQueryBuilder()
            .select('COUNT(tag.id) as exist')
            .leftJoin('taug.todoAccessGroup', 'tag')
            .where(`
                (
                    taug.userId = :userId
                    AND
                    taug.todoAccessGroupId = :groupId
                )
                OR
                (
                    tag.id = :groupId
                    AND
                    tag.userId = :userId
                )
            `, {userId, groupId});

        const result = await query.getRawOne();

        return Boolean(Number(result['exist']));
    }
}