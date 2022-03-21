import { SelectQueryBuilder } from 'typeorm';
import RuntimeError from '../../Framework/Exceptions/RuntimeError';
import TodoItem from '../Entity/TodoItem';
import TodoStatus from '../Entity/TodoStatus';
import TodoStatusGroup from '../Entity/TodoStatusGroup';
import TodoItemCreateRequest from '../FormRequest/TodoItem/TodoItemCreateRequest';
import TodoStatusRepository from './TodoStatusRepository';
import TodoStatusGroupRepository from './TodoStatusGroupRepository';

export default class TodoItemRepository
{
    /**
     * @return SelectQueryBuilder<TodoItem>
     */
    protected static getQueryBuilder(): SelectQueryBuilder<TodoItem>
    {
        return TodoItem.createQueryBuilder('todo_item');
    }

    /**
     * Поиск по ид.
     * 
     * @param  number id
     * @return Promise<TodoItem|undefined>
     */
    public static async findById(id: number): Promise<TodoItem | undefined>
    {
        return await TodoItem.findOne({ where: { id } });
    }

    /**
     * Возвращает
     * туду-задание пользователя.
     * 
     * @param  number id
     * @param  number userId
     * @return 
     */
    public static async getUserTodoById(id: number, userId: number): Promise<TodoItem | undefined>
    {
        return await TodoItem.findOne({ where: { id, userId } });
    }
    
    /**
     * Поиск по ид пользователя.
     * 
     * @param  number userId
     * @return Promise<TodoItem[]>
     */
    public static async findByUserId(userId: number): Promise<TodoItem[]>
    {
        return await TodoItem.find({ where: { userId } });
    }

    /**
     * Загрузка свойств
     * модели из объекта.
     * 
     * @param  TodoItem model
     * @param  object data
     * @return TodoItem
     */
    protected static loadModel(model: TodoItem, data: object): TodoItem
    {
        for(const key in data) {
            model[key] = data[key];
        }

        return model;
    }

    /**
     * Создает новое задание.
     * 
     * @param  TodoItemCreateRequest data 
     * @return Promise<TodoItem>
     */
    public static async createNew(data: TodoItemCreateRequest): Promise<TodoItem>
    {
        data.statusId = await TodoStatusRepository.getInitialStatusId();
        
        const model = this.loadModel(new TodoItem, data);

        await model.save();

        return model;
    }

    /**
     * Удаляет задание по ID
     * 
     * @param  number id
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
     * Возвращает группированные
     * задания пользователя по статусам.
     * 
     * @param  number userId 
     * @return Promise<TodoStatusGroup[]>
     */
    public static async getTodoesGroupedByStatuses(userId: number): Promise<TodoStatusGroup[]>
    {
        const statusGroups: TodoStatusGroup[] = [];

        const statuses = await TodoStatus.find();

        for (const status of statuses) {
            const statusGroup: TodoStatusGroup = await TodoStatusGroupRepository.createGroup(status, userId);
            statusGroups.push(statusGroup);
        }

        return statusGroups;
    }

    /**
     * Обновление модели.
     * 
     * @param  TodoItem item 
     * @param  object attributes 
     * @return Promise<TodoItem>
     */
    public static async update(item: TodoItem, attributes: object): Promise<TodoItem>
    {
        await this.getQueryBuilder()
            .update(TodoItem)
            .set(attributes)
            .where("id = :id", { id: item.id })
            .execute();

        const updatedItem = await this.findById(item.id);

        if (updatedItem instanceof TodoItem) {
            return updatedItem;
        }

        throw new RuntimeError('Модель задания не найдена после обновления');
    }

}
