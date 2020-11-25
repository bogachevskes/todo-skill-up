import TodoStatus from '../entity/TodoStatus';

const INITIAL_DEFAULT_FLAG = 1;

export default class TodoStatusRepository
{
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

}
