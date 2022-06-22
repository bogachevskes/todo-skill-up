import TodoStatus from '../Entity/TodoStatus';
import TodoItem from '../Entity/TodoItem';
import TodoStatusGroup from '../Entity/TodoStatusGroup';
import TodoAccessUserGroup from '../Entity/TodoAccessUserGroup';

export default class TodoStatusGroupRepository
{
    /**
     * @param  { TodoStatus } status
     * @param  { number } userId
     * @return { Promise<TodoStatusGroup> }
     */
    public static async createGroup(status: TodoStatus, userId: number): Promise<TodoStatusGroup>
    {
        const todo: TodoItem[] = await TodoItem.find({
                where: {
                    statusId: status.id,
                    userId
                },
            });
        
        return new TodoStatusGroup(status, todo);
    }

    /**
     * @param  { TodoStatus } status
     * @param  { number } userId
     * @param  { number } accessGroupId
     * @return { Promise<TodoStatusGroup> }
     */
     public static async createGroupOfAccessGroup(status: TodoStatus, userId: number, accessGroupId: number): Promise<TodoStatusGroup>
     {
        const todo: TodoItem[] = await TodoItem.createQueryBuilder('ti')
            .leftJoin(TodoAccessUserGroup, 'taug', 'ti.todo_access_group_id = taug.todo_access_group_id')
            .where(`
                ti.statusId = :statusId
                AND
                ti.todoAccessGroupId = :todoAccessGroupId
                AND
                (
                    ti.userId = :userId
                    OR
                    taug.userId = :userId
                )`,
                {
                    statusId: status.id,
                    todoAccessGroupId: accessGroupId,
                    userId,
                }
            )
            .groupBy('ti.id')
            .getMany();
         
         return new TodoStatusGroup(status, todo);
     }
}