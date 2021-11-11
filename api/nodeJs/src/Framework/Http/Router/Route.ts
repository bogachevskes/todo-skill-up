import MiddleWareInterface from '../Middleware/MiddlewareInterface';
import ControllerInterface from '../Controller/ControllerInterface';

export default class Route
{
    public method: string;
    public path: string;
    public controller: ControllerInterface;
    public action: string;
    public middleware: MiddleWareInterface[];

    public constructor(method: string, path: string, controller: ControllerInterface, action: string, middleware: MiddleWareInterface[] = [])
    {
        this.method = method;
        this.path = path;
        this.controller = controller;
        this.action = action;
        this.middleware = middleware;
    }
}