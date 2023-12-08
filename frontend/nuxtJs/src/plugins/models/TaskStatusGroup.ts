import TaskStatusGroupInterface from '../base/TaskStatusGroupInterface';
import TasksFactory from '../services/TasksFactory';
import TaskStatus from './TaskStatus';
import Task from './Task';

export default class TaskStatusGroup implements TaskStatusGroupInterface
{

    public status: TaskStatus;
    public tasks: Task[];

    public constructor(taskStatusGroup: TaskStatusGroupInterface)
    {
        this.status = new TaskStatus(taskStatusGroup.status);

        this.tasks = (new TasksFactory).make(taskStatusGroup.tasks);
    }
}
