import Configurable from '../base/Configurable';
import DateHelper from '../helpers/DateHelper';

export default class TodoItem extends Configurable {
    public id: number | undefined;

    public name: string | undefined;

    public statusId: number | undefined;

    public description: string | undefined;

    public plannedComplitionAt: string | undefined;

    public createdAt: string | undefined;

    /**
     * Выводит читаемую дату выполнения.
     *
     * @return string
     */
    public printPlannedCompilationAt(): string | null {
        if (this.plannedComplitionAt === undefined) {
            return null;
        }

        return DateHelper.printFormatted(
            this.plannedComplitionAt,
            'DD.MM.YYYY'
        );
    }

    /**
     * Выводит читаемую дату создания.
     *
     * @return string
     */
    public printCreatedAt(): string | null {
        if (this.createdAt === undefined) {
            return null;
        }

        return DateHelper.printFormatted(this.createdAt, 'DD.MM.YYYY');
    }

    /**
     * Возвращает описание.
     *
     * @param  string defaultContent
     * @return string
     */
    public printDescription(defaultContent: string = 'Не указано'): string {
        return this.description || defaultContent;
    }

    /**
     * Создает новую модель.
     *
     * @param  object card
     * @return TodoItem
     */
    public static getInstance(card: object): TodoItem {
        return new this(card);
    }
}
