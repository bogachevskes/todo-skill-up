export default abstract class Configurable
{
    protected constructor(parameters: object = {})
    {
        this.configure(parameters);
    }

    protected configure(parameters: object): void
    {
        for (let parameter in parameters) {
            this[parameter] = parameters[parameter];
        }
    }
}