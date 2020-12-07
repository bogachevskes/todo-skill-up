export default class RouteData
{
    public method: string;
    public path: string;

    public constructor(method: string, path: string)
    {
        this.method = method;
        this.path = path;
    }
}