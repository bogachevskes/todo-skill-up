import { SelectQueryBuilder } from 'typeorm';
import TodoStatus from '../entity/TodoStatus';

const INITIAL_DEFAULT_FLAG = 1;

export default class TodoStatusRepository
{
    /**
     * Поиск по ид.
     * 
     * @param  number id
     * @return Promise<TodoItem|undefined>
     */
    public static async findById(id: number): Promise<TodoStatus | undefined>
    {
        return await TodoStatus.findOne({ where: { id } });
    }
    
    /**
     * @return SelectQueryBuilder<TodoItem>
     */
    protected static getQueryBuilder(): SelectQueryBuilder<TodoStatus>
    {
        return TodoStatus.createQueryBuilder('todo_status');
    }
    
    /**
     * Возвращает модель статуса по умолчанию.
     * 
     * @return Promise<TodoStatus|undefined>
     */
    public static async getInitialStatusModel(): Promise<TodoStatus|undefined>
    {
        return await TodoStatus.findOne({where: { initialDefault: INITIAL_DEFAULT_FLAG }});
    }
    
    /**
     * Возвращает идентификатор
     * статуса по умолчанию при создании задачи.
     * 
     * @return Promise<number>
     */
    public static async getInitialStatusId(): Promise<number>
    {
        const initial = await this.getInitialStatusModel();

        if (initial instanceof TodoStatus) {
            return initial.id;
        }

        const model = TodoStatus.findOne();

        if (model instanceof TodoStatus) {
            return model.id;
        }
        
        throw new Error('Необходимо создать хотя бы 1 статус');
    }

    /**
     * Сброс флага изначального статуса.
     * 
     * @return Promise<void>
     */
    public static async flushInitialDefaults(): Promise<void>
    {
        await this.getQueryBuilder()
            .update(TodoStatus) 
            .set({ initialDefault: null })
            .execute();
    }

    /**
     * Создание нового статуса.
     * 
     * @param  string name
     * @return Promise<TodoStatus>
     */
    public static async createNew(name: string, initialDefault: boolean = false): Promise<TodoStatus>
    {
        const model = new TodoStatus;

        model.name = name;

        if (initialDefault) {
            await this.flushInitialDefaults();
            model.initialDefault = 1;
        }

        await model.save();

        return model;
    }

}
