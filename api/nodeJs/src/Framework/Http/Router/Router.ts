import { Router  as BaseRouter } from 'express';
import asyncHandler from 'express-async-handler';
import { asyncMiddleware } from 'middleware-async';
import Route from './Route';
import ControllerInterface from '../Controller/ControllerInterface';
import MiddlewareInterface from '../Middleware/MiddlewareInterface';

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
     * @param  Function middlewareClass 
     * @return Function
     */
    protected resolveMiddleware(middlewareClass: Function): Function
    {
        const middleware: MiddlewareInterface = eval(`new middlewareClass`);

        return asyncMiddleware(middleware.execute);
    }

    /**
     * @param  Function[] middlewareClasses
     * @return Function[]
     */
    protected resolveMiddlewareMultiple(middlewareClasses: Function[]): Function[]
    {
        const handlers: Function[] = [];
        
        for (const handler of middlewareClasses) {
            handlers.push(
                this.resolveMiddleware(handler)
            );
        }

        return handlers;
    }

    /**
     * @param  Function controllerClass
     * @return Function
     */
    protected resolveController(controllerClass: Function, action: string): Function
    {
        const controller: ControllerInterface = eval(`new controllerClass`);

        return asyncHandler(controller[action]);
    }

    /**
     * @param  Route[] routes
     * @return void
     */
    public configureRoutes(routes: Route[]): void
    {
        this.routes = routes;
        
        for (const route of this.routes) {
            
            let handlers: Function[]  = [];

            if (route.middleware.length !== null) {
                
                const middleware: Function [] = this.resolveMiddlewareMultiple(route.middleware);
                
                handlers = handlers.concat(middleware);
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