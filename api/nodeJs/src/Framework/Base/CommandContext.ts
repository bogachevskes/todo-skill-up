export default class CommandContext
{
    protected params: object = {};

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

    public all(): object
    {
        return this.params;
    }

    public walk(attributes: object = {}): void
    {
        for (const prop in attributes) {
            this.set(prop, attributes[prop]);
        }
    }

}