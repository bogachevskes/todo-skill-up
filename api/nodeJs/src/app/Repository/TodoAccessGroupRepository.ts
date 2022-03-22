import { SelectQueryBuilder } from 'typeorm';
import TodoAccessGroup from '../Entity/TodoAccessGroup';
import TodoAccessGroupCreateRequest from '../FormRequest/TodoAccessGroup/TodoAccessGroupCreateRequest';

export default class TodoAccessGroupRepository
{
    /**
     * @return SelectQueryBuilder<TodoAccessGroup>
     */
    protected static getQueryBuilder(): SelectQueryBuilder<TodoAccessGroup>
    {
        return TodoAccessGroup.createQueryBuilder('tag');
    }

    /**
     * Загрузка свойств
     * модели из объекта.
     * 
     * @param  TodoAccessGroup model
     * @param  object data
     * @return TodoAccessGroup
     */
     protected static loadModel(model: TodoAccessGroup, data: object): TodoAccessGroup
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
     * @return Promise<TodoAccessGroup[]>
     */
    public static async findByUserId(userId: number): Promise<TodoAccessGroup[]>
    {
        const query = this.getQueryBuilder()
            .select(['tag.id', 'tag.name', 'tag.createdAt'])
            .leftJoin('tag.users', 'taug', )
            .where('taug.userId = :userId', { userId })
            .orWhere('tag.userId = :userId', { userId });

        return query.getMany();
    }

    /**
     * @param  userId 
     * @param  id 
     * @returns Promise<TodoAccessGroup | undefined>
     */
    public static async findOneByUserId(userId: number, id: number): Promise<TodoAccessGroup | undefined>
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
     * @return TodoAccessGroupCreateRequest
     */
    public static async createNew(data: TodoAccessGroupCreateRequest): Promise<TodoAccessGroup | undefined>
    {
        const model = this.loadModel(new TodoAccessGroup, data);

        await model.save();

        return await TodoAccessGroup.findOne({select: ['id', 'name', 'description', 'createdAt', 'updatedAt'], where: {id: model.id}});
    }

    /**
     * @param  TodoItem item 
     * @param  object attributes 
     * @return Promise<TodoAccessGroup>
     */
    public static async update(item: TodoAccessGroup, attributes: object): Promise<TodoAccessGroup | undefined>
    {
        const model = this.loadModel(item, attributes);
        
        await model.save();

        return await TodoAccessGroup.findOne({select: ['id', 'name', 'description', 'createdAt', 'updatedAt'], where: {id: model.id}});
    }
}