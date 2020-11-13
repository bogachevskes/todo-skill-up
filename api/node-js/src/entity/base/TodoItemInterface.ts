export default interface TodoItemInterface
{
    id: number;
    userId: number;
    statusId: number;
    name: string;
    description: string;
    plannedComplitionAt: Date | null;
}