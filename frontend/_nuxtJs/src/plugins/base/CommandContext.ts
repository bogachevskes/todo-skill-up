import IndexedInterface from './IndexedInterface';

export default class CommandContext {
    protected params: object = {};

    /**
     * @param  params
     * @return void
     */
    public setMultiple(params: object): void {
        Object.assign(this.params, params);
    }

    /**
     * @param  key string
     * @param  value any
     * @return void
     */
    public set(key: string, value: any): void {
        Object.assign(this.params, { [key]: value });
    }

    /**
     * @param  key string
     * @return any
     */
    public get(key: string): any {
        const params: IndexedInterface = {};

        Object.assign(params, this.params);

        if (key in params) {
            return params[key];
        }

        return null;
    }

    /**
     * @returns any[]
     */
    public getKeys(): any[] {
        return Object.keys(this.params);
    }

    /**
     * @returns object
     */
    public getParams(): object {
        return this.params;
    }
}
