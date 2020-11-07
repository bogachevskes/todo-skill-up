import Configurable from '../base/Configurable';
import DateHelper from '../helpers/DateHelper';

export default class TodoItem extends Configurable
{
    public plannedComplitionAt: string;

    public createdAt: string;
    
    /**
     * Выводит читаемую дату выполнения.
     * 
     * @return string
     */
    public printPlannedCompilationAt(): string
    {
        return DateHelper.printFormatted(this.plannedComplitionAt);
    }

    /**
     * Выводит читаемую дату создания.
     * 
     * @return string
     */
    public printCreatedAt(): string
    {
        return DateHelper.printFormatted(this.createdAt);
    }
    
    /**
     * Создает новую модель.
     * 
     * @param  object card
     * @return TodoItem
     */
    public static getInstance(card): TodoItem
    {
        return new this(card);
    }
}