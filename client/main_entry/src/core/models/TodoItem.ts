import Configurable from '../base/Configurable';
import DateHelper from '../helpers/DateHelper';

export default class TodoItem extends Configurable
{
    public id: number|null;

    public name: string;

    public description: string;
    
    public plannedComplitionAt: string;

    public createdAt: string;
    
    /**
     * Выводит читаемую дату выполнения.
     * 
     * @return string
     */
    public printPlannedCompilationAt(): string
    {
        return DateHelper.printFormatted(this.plannedComplitionAt, 'DD.MM.YYYY');
    }

    /**
     * Выводит читаемую дату создания.
     * 
     * @return string
     */
    public printCreatedAt(): string
    {
        return DateHelper.printFormatted(this.createdAt, 'DD.MM.YYYY');
    }

    /**
     * Возвращает описание.
     * 
     * @param  string defaultContent 
     * @return string
     */
    public printDescription(defaultContent: string = 'Не указано'): string
    {
        return this.description || defaultContent;
    }
    
    /**
     * Создает новую модель.
     * 
     * @param  object card
     * @return TodoItem
     */
    public static getInstance(card: object = {}): TodoItem
    {
        return new this(card);
    }
}