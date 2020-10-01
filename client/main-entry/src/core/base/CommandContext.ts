export default class CommandContext
{
    protected params: object = {};

    protected errors: object = {};

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

}