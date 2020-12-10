export default class RouteData
{
    public method: string;
    public path: string;
    public action: string;

    public constructor(method: string, path: string, action: string|null = null)
    {
        this.method = method;
        this.path = path;
        this.action = action ? action : path;
    }
}