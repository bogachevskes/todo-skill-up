export default class Route
{
    public method: string;
    public path: string;
    public controller: Function;
    public action: string;
    public middleware: Function[]|object[];

    public constructor(method: string, path: string, controller: Function, action: string, middleware: Function[]|object[] = [])
    {
        this.method = method;
        this.path = path;
        this.controller = controller;
        this.action = action;
        this.middleware = middleware;
    }
}