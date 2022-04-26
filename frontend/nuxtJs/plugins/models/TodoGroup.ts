import Configurable from '../base/Configurable';
import TodoGroupInterface from '../base/TodoGroupInterface';
import TodoStatus from './TodoStatus';
import TodoItem from './TodoItem';
import TodoItemService from '../services/TodoItemService';

export default class TodoGroup extends Configurable implements TodoGroupInterface
{
    public status: TodoStatus | undefined;

    public todoes: TodoItem[] = [];
    
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
            todoes: TodoItemService.createCards(groups.todoes),
        };
        
        return new this(configuration);
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