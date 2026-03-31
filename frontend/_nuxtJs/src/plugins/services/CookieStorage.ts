import IndexedInterface from '../base/IndexedInterface';

export default class CookieStorage
{

    private params: object = {};

    public getItem(key: string): any {
        const params: IndexedInterface = {};

        Object.assign(params, this.params);

        if (key in params) {
            return params[key];
        }

        return null;
    }

    public setItem(key: string, value: any): void {
        Object.assign(this.params, { [key]: value });
    }

    public setItems(values: object): void {
        Object.assign(this.params, values);
    }

    public clear(): void {
        this.params = {};
    }
}
