import TodoGroup from '../models/TodoGroup';
import TodoGroupInterface from '../models/base/TodoGroupInterface';

export default class TodoItemService
{
    public static createGroups(groups: TodoGroupInterface[]): TodoGroup[]
    {
        const newGroups: TodoGroup[] = [];
        
        for (const group of groups) {
            
            newGroups.push(
                    TodoGroup.getInstance(group)
                );
        }

        return newGroups;
    }
}