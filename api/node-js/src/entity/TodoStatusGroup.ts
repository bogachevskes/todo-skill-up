import TodoItem from './TodoItem';
import TodoStatus from './TodoStatus';

export default class TodoStatusGroup
{
    public status: TodoStatus;

    public todoes: TodoItem[] = [];

    public constructor(status: TodoStatus, todoes: TodoItem[] = [])
    {
        this.status = status;
        this.todoes = todoes;
    }
}