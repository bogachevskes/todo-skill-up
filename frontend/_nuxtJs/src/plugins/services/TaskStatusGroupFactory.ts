import TaskStatusGroup from '../models/TaskStatusGroup';
import TaskStatusGroupInterface from '../base/TaskStatusGroupInterface';

export default class TaskStatusGroupFactory
{
    public make(taskStatusGroups: TaskStatusGroupInterface[]): TaskStatusGroup[] {
        const newGroups: TaskStatusGroup[] = [];

        for (const group of taskStatusGroups) {
            newGroups.push(new TaskStatusGroup(group));
        }

        return newGroups;
    }
}
