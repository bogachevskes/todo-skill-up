import Configurable from '../base/Configurable';

export default class TodoStatus extends Configurable
{
    public id: number;

    public name: string;
    
    public initialDefault: number;
    
    /**
     * Создает новую модель.
     * 
     * @param  object status
     * @return TodoStatus
     */
    public static getInstance(status: object = {}): TodoStatus
    {
        return new this(status);
    }
}