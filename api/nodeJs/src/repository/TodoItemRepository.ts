import { SelectQueryBuilder } from 'typeorm';
import TodoItem from '../entity/TodoItem';
import TodoStatus from '../entity/TodoStatus';
import TodoStatusGroup from '../entity/TodoStatusGroup';
import TodoItemInterface from '../entity/base/TodoItemInterface';
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
     * @param  TodoItemInterface data
     * @return TodoItem
     */
    protected static loadModel(model: TodoItem, data: TodoItemInterface): TodoItem
    {
        for(const key in data) {
            model[key] = data[key];
        }

        return model;
    }

    /**
     * Создает новое задание.
     * 
     * @param  TodoItemInterface data 
     * @preturn Promise<TodoItem>
     */
    public static async createNew(data: TodoItemInterface): Promise<TodoItem>
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
}