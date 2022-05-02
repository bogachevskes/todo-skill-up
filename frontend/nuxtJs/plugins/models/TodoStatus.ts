import Configurable from '../base/Configurable';

export default class TodoStatus extends Configurable {
    public id: number | undefined;

    public name: string | undefined;

    public initialDefault: number | undefined;

    /**
     * Создает новую модель.
     *
     * @param  object status
     * @return TodoStatus
     */
    public static getInstance(status: object = {}): TodoStatus {
        return new this(status);
    }
}
