import TodoStatus from '../Entity/TodoStatus';
import TodoItem from '../Entity/TodoItem';
import TodoStatusGroup from '../Entity/TodoStatusGroup';
import TodoGroup from '../Entity/TodoGroup';
import TodoUsersGroups from '../Entity/TodoUsersGroups';

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
     * @param  { number } groupId
     * @return { Promise<TodoStatusGroup> }
     */
     public static async createGroupOfGroup(status: TodoStatus, userId: number, groupId: number): Promise<TodoStatusGroup>
     {
        const query = TodoItem.createQueryBuilder('ti')
            .leftJoin(TodoGroup, 'tag','ti.todo_group_id = tag.id')
            .leftJoin(TodoUsersGroups, 'taug', 'ti.todo_group_id = taug.todo_group_id')
            .where(`
                ti.statusId = :statusId
                AND
                ti.todoGroupId = :todoGroupId
                AND
                (
                    ti.userId = :userId
                    OR
                    taug.userId = :userId
                    OR
                    tag.user_id = :userId
                )`,
                {
                    statusId: status.id,
                    todoGroupId: groupId,
                    userId,
                }
            )
            .groupBy('ti.id');

        const todo: TodoItem[] = await query.getMany();
         
        return new TodoStatusGroup(status, todo);
     }
}