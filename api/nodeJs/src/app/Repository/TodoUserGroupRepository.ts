import { SelectQueryBuilder } from 'typeorm';
import TodoUsersGroups from '../Entity/TodoUsersGroups';

export default class TodoUserGroupRepository
{
    /**
     * @return SelectQueryBuilder<TodoGroup>
     */
    protected static getQueryBuilder(): SelectQueryBuilder<TodoUsersGroups>
    {
        return TodoUsersGroups.createQueryBuilder('taug');
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
     * @returns Promise<TodoUsersGroups | undefined>
     */
    public static async findOneByUserId(userId: number, id: number): Promise<TodoUsersGroups | undefined>
    {
        const query = this.getQueryBuilder()
            .select(['taug.id'])
            .leftJoin('taug.todoGroup', 'tag')
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
             .select('COUNT(taug.id) as exist')
             .where('taug.userId = :userId AND taug.todoGroupId = :groupId', {userId, groupId});
 
         const result = await query.getRawOne();
 
         return Boolean(Number(result['exist']));
     }
}