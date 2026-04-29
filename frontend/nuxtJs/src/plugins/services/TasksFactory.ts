import Task from '../models/Task';

export default class TasksFactory
{
    public make(tasks: Task[]): Task[] {
        const newCards: Task[] = [];

        for (const task of tasks) {
            newCards.push(new Task(task));
        }

        return newCards;
    }
}
