import TodoStatus from '../models/TodoStatus';
import TodoItem from '../models/TodoItem';

export default interface TodoGroupInterface {
    status: TodoStatus | undefined;

    todo: TodoItem[];
}
