import { SelectQueryBuilder } from 'typeorm';
import TodoGroup from '../Entity/TodoGroup';
import TodoUsersGroups from '../Entity/TodoUsersGroups';
import TodoGroupCreateRequest from '../FormRequest/TodoGroup/TodoGroupCreateRequest';

export default class TodoGroupRepository
{
    /**
     * @return SelectQueryBuilder<TodoGroup>
     */
    protected static getQueryBuilder(): SelectQueryBuilder<TodoGroup>
    {
        return TodoGroup.createQueryBuilder('tag');
    }

    /**
     * Загрузка свойств
     * модели из объекта.
     * 
     * @param  TodoGroup model
     * @param  object data
     * @return TodoGroup
     */
     protected static loadModel(model: TodoGroup, data: object): TodoGroup
     {
         for(const key in data) {
             model[key] = data[key];
         }
 
         return model;
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

    /**
     * @param  number userId
     * @return Promise<TodoGroup[]>
     */
    public static async findByUserId(userId: number): Promise<TodoGroup[]>
    {
        const query = this.getQueryBuilder()
            .select(['tag.id', 'tag.name', 'tag.createdAt'])
            .leftJoin(TodoUsersGroups, 'taug', 'tag.id = taug.todoGroupId')
            .where('taug.userId = :userId', { userId })
            .orWhere('tag.userId = :userId', { userId });

        return query.getMany();
    }

    /**
     * @param  id 
     * @returns Promise<TodoGroup | undefined>
     */
    public static async findOneById(id: number): Promise<Object | undefined>
    {
        const query = this.getQueryBuilder()
            .select([
            'tag.id as id',
            'tag.name as name',
            'tag.description as description',
            'tag.createdAt as createdAt',
            'u.id as user_id',
            'u.name as user_name',
            'u.email as user_email',
        ])
        .leftJoin('tag.user', 'u')
        .where('tag.id = :id', { id });

        return query.getRawOne();
    }

    /**
     * @param  userId 
     * @param  id 
     * @returns Promise<TodoGroup | undefined>
     */
    public static async findOneByUserId(userId: number, id: number): Promise<TodoGroup | undefined>
    {
        const query = this.getQueryBuilder()
            .select(['tag.id', 'tag.name'])
            .leftJoin('tag.user', 'u')
            .where('tag.id = :id AND (u.id = :userId OR tag.userId = :userId)', { id, userId });

        return query.getOne();
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
     * @param  data 
     * @return TodoGroupCreateRequest
     */
    public static async createNew(data: TodoGroupCreateRequest): Promise<TodoGroup | undefined>
    {
        const model = this.loadModel(new TodoGroup, data);

        await model.save();

        return await TodoGroup.findOne({select: ['id', 'name', 'description', 'createdAt', 'updatedAt'], where: {id: model.id}});
    }

    /**
     * @param  TodoItem item 
     * @param  object attributes 
     * @return Promise<TodoGroup>
     */
    public static async update(item: TodoGroup, attributes: object): Promise<TodoGroup | undefined>
    {
        const model = this.loadModel(item, attributes);
        
        await model.save();

        return await TodoGroup.findOne({select: ['id', 'name', 'description', 'createdAt', 'updatedAt'], where: {id: model.id}});
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
            .leftJoin(TodoUsersGroups, 'taug', 'tag.id = taug.todoGroupId')
            .where(`
                (
                    taug.userId = :userId
                    AND
                    taug.todoGroupId = :groupId
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