export default class CommandContext
{
    protected params: object = {};

    /**
     * Запись значение по ключу.
     * 
     * @param  string key
     * @param  value value
     * @return void
     */
    public set(key: string, value: any): void
    {
        this.params[key] = value;
    }

    /**
     * Получить значение по ключу.
     * 
     * @param  string key
     * @return any
     */
    public get(key: string): any
    {
        if (key in this.params) {
            return this.params[key];
        }

        return null;
    }

    /**
     * Возвращает все значения.
     * 
     * @return object
     */
    public all(): object
    {
        return this.params;
    }

    /**
     * Преобразовать объект в контекст.
     * 
     * @param  object attributes
     * @return void
     */
    public walk(attributes: object = {}): void
    {
        for (const prop in attributes) {
            this.set(prop, attributes[prop]);
        }
    }

}