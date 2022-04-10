export default class RoutesResource
{
    public path: string;
    public controller: Function;
    public routes: object = {};
    public middleware: Function[] = [];
    public rules: object = {};

    public constructor(path: string, controller: Function, routes: object, middleware: Function[], rules: object = {})
    {
        this.path = path;
        this.controller = controller;
        this.routes = routes;
        this.middleware = middleware;
        this.rules = rules;
    }
}