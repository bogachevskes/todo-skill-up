import TodoGroup from '../models/TodoGroup';
import TodoGroupInterface from '../models/base/TodoGroupInterface';

export default class TodoItemService
{
    /**
     * Создает модели групп.
     * 
     * @param  groups 
     * @return TodoGroupInterface[]
     */
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