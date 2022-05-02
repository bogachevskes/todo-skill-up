import IndexedInterface from '../base/IndexedInterface';

export default class CookieStorage {
    /**
     * @var object
     */
    private params: object = {};

    /**
     * @param  string key
     * @return any
     */
    public getItem(key: string): any {
        const params: IndexedInterface = {};

        Object.assign(params, this.params);

        if (key in params) {
            return params[key];
        }

        return null;
    }

    /**
     * @param  key string
     * @param  value any
     * @return void
     */
    public setItem(key: string, value: any): void {
        Object.assign(this.params, { [key]: value });
    }

    /**
     * @param  object values
     * @return void
     */
    public setItems(values: object): void {
        Object.assign(this.params, values);
    }

    /**
     * @return void
     */
    public clear(): void {
        this.params = {};
    }
}
