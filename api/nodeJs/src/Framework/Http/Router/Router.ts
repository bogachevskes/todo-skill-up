import { Router  as BaseRouter } from 'express';
import asyncHandler from 'express-async-handler';
import { asyncMiddleware } from 'middleware-async';
import Route from './Route';
import MiddleWareInterface from '../Middleware/MiddlewareInterface';
import ControllerInterface from '../Controller/ControllerInterface';

export default class Router
{
    /**
     * @type BaseRouter
     */
    protected router;

    /**
     * @type Route[]
     */
    protected routes: Route[];
    
    public constructor()
    {
        this.router = BaseRouter();
    }

    /**
     * @type object
     */
    protected middleware: object = {};

    /**
     * @type object
     */
    protected controllers: object = {};

    /**
     * @param  MiddleWareInterface middleware 
     * @return Function
     */
    protected resolveMiddleware(middleware: MiddleWareInterface): Function
    {
        const className = middleware.constructor.name;
        
        if (! (className in this.middleware)) {
            this.middleware[className] = eval(`new middleware`);
        }
        
        return asyncMiddleware(this.middleware[className].execute);
    }

    /**
     * @param  MiddleWareInterface[] middleware 
     * @return Function[]
     */
    protected resolveMiddlewareMultiple(middleware: MiddleWareInterface[]): Function[]
    {
        const handlers: Function[] = [];
        
        for (const handler of middleware) {
            handlers.push(
                this.resolveMiddleware(handler)
            );
        }

        return handlers;
    }

    /**
     * @param  ControllerInterface controller
     * @return Function
     */
     protected resolveController(controller: ControllerInterface, action: string): Function
     {
        const className = controller.constructor.name;
        
        if (! (className in this.controllers)) {
            this.controllers[className] = eval(`new controller`);
        }
        
        return asyncHandler(this.controllers[className][action]);
     }

    /**
     * @param  Route[] routes
     * @return void
     */
    public configure(routes: Route[]): void
    {
        this.routes = routes;
        
        for (const route of this.routes) {
            
            const handlers: Function[]  = [];

            if (route.middleware.length !== null) {
                
                handlers.concat(this.resolveMiddlewareMultiple(route.middleware));
            }
            
            handlers.push(
                this.resolveController(route.controller, route.action)
            );
            
            this.router[route.method.toLowerCase()](
                route.path,
                handlers
            );
        }
    }

    /**
     * @return BaseRouter
     */
    public getRoutes(): BaseRouter
    {
        return this.router;
    }
}