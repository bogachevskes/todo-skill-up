import TodoStatus from '../entity/TodoStatus';
import TodoItem from '../entity/TodoItem';
import TodoStatusGroup from '../entity/TodoStatusGroup';

export default class TodoStatusGroupRepository
{
    public static async createGroup(status: TodoStatus, userId: number): Promise<TodoStatusGroup>
    {
        const todoes: TodoItem[] = await TodoItem.find({
                where: { statusId: status.id, userId }
            });
        
        return new TodoStatusGroup(status, todoes);
    }
}