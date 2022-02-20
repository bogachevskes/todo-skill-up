import TodoStatus from '../TodoStatus';
import TodoItem from '../TodoItem';

export default interface TodoGroupInterface
{
    status: TodoStatus;

    todoes: TodoItem[];
}