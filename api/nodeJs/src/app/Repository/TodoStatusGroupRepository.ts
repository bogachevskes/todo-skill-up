import TodoStatus from '../Entity/TodoStatus';
import TodoItem from '../Entity/TodoItem';
import TodoStatusGroup from '../Entity/TodoStatusGroup';

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