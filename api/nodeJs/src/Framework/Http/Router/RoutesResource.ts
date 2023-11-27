export default class RoutesResource
{
    public path: string;
    public controller: Function;
    public middleware: Function[];
    public routes: object[];
    public rules: object;

    public constructor(path: string, controller: Function, middleware: Function[], routes: object[] = [], rules: object = {})
    {
        this.path = path;
        this.controller = controller;
        this.middleware = middleware;
        this.routes = routes;
        this.rules = rules;
    }
}