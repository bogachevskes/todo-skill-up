import Configurable from '../base/Configurable';
import DateHelper from '../helpers/DateHelper';

export default class Task extends Configurable
{
    public id: number | undefined;

    public name: string | undefined;

    public statusId: number | undefined;

    public description: string | undefined;

    public plannedCompletionAt: string | undefined;

    public createdAt: string | undefined;

    public printPlannedCompilationAt(): string | null
    {
        if (this.plannedCompletionAt === undefined) {
            return null;
        }

        return DateHelper.printFormatted(
            this.plannedCompletionAt,
            'DD.MM.YYYY'
        );
    }

    public printCreatedAt(): string | null
    {
        if (this.createdAt === undefined) {
            return null;
        }

        return DateHelper.printFormatted(this.createdAt, 'DD.MM.YYYY');
    }

    public printDescription(defaultContent: string = 'Не указано'): string
    {
        return this.description || defaultContent;
    }
}
