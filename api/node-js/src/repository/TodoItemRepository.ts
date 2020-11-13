import TodoItem from '../entity/TodoItem';
import TodoItemInterface from '../entity/base/TodoItemInterface';
import TodoStatusRepository from './TodoStatusRepository';

export default class TodoItemRepository
{
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

    protected static loadModel(model: TodoItem, data: TodoItemInterface): TodoItem
    {
        for(const key in data) {
            model[key] = data[key];
        }

        return model;
    }

    public static async createNew(data: TodoItemInterface): Promise<TodoItem>
    {
        data.statusId = await TodoStatusRepository.getInitialtStatusId();
        
        const model = this.loadModel(new TodoItem, data);

        await model.save();

        return model;
    }
}