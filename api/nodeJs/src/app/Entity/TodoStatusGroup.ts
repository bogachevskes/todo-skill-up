import TodoItem from './TodoItem';
import TodoStatus from './TodoStatus';

export default class TodoStatusGroup
{
    public status: TodoStatus;

    public todo: TodoItem[] = [];

    public constructor(status: TodoStatus, todo: TodoItem[] = [])
    {
        this.status = status;
        this.todo = todo;
    }
}