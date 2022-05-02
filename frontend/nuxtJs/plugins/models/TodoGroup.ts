import TodoGroupInterface from '../base/TodoGroupInterface';
import TodoStatus from './TodoStatus';
import TodoItem from './TodoItem';
import TodoItemService from '../services/TodoItemService';

export default class TodoGroup implements TodoGroupInterface
{
    public status: TodoStatus | undefined;

    public todo: TodoItem[] = [];
    
    /**
     * Создает новую модель.
     * 
     * @param  object card
     * @return TodoItem
     */
    public static getInstance(groups: TodoGroupInterface): TodoGroup
    {
        const configuration = {
            status: TodoStatus.getInstance(groups.status),
            todo: TodoItemService.createCards(groups.todo),
        };

        const instance = new this;

        Object.assign(instance, configuration);
        
        return instance;
    }

    /**
     * Группа по умолчанию?
     * 
     * @return boolean
     */
    public isInitialDefault(): boolean
    {
        return Boolean(this.status!.initialDefault);
    }
}