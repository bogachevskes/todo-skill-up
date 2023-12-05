import TaskStatus from '../models/TaskStatus';
import Task from '../models/Task';

export default interface TaskStatusGroupInterface {
    status: TaskStatus | undefined;

    tasks: Task[];
}
