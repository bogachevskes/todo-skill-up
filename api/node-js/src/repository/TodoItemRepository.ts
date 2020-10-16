import TodoItem from '../entity/TodoItem';

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
}