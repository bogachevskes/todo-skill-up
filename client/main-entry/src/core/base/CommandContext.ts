export default class CommandContext
{
    protected params: object = {};

    public setMultiple(params: object): void
    {
        const keys = Object.keys(params);
        
        for (const key of keys) {
            this.set(key, params[key]);
        }
    }

    public set(key: string, value: any): void
    {
        this.params[key] = value;
    }

    public get(key: string): any
    {
        if (key in this.params) {
            return this.params[key];
        }

        return null;
    }

    public getKeys(): any[]
    {
        return Object.keys(this.params);
    }

    public getParams(): object
    {
        return this.params;
    }

}