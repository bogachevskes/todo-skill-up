import { IsNull } from "typeorm";
import TodoStatus from '../Entity/TodoStatus';
import TodoItem from '../Entity/TodoItem';
import TodoStatusGroup from '../Entity/TodoStatusGroup';

export default class TodoStatusGroupRepository
{
    /**
     * @param status TodoStatus
     * @param userId number
     * @param accessGroupId number|null
     * @returns Promise<TodoStatusGroup>
     */
    public static async createGroup(status: TodoStatus, userId: number, accessGroupId: number|null = null): Promise<TodoStatusGroup>
    {
        const condition = {
            statusId: status.id,
            userId,
            todoAccessGroupId: (accessGroupId === null ? IsNull() : accessGroupId),
        };
        
        const todo: TodoItem[] = await TodoItem.find({
                where: {...condition},
            });
        
        return new TodoStatusGroup(status, todo);
    }
}