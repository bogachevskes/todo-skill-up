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
     * @param  Function[] middlewareClasses
     * @return Function[]
     */
    protected resolveMiddlewareMultiple(middlewareClasses: Function[]): Function
    {
        let chainHandler,
            nextHandler;
        
        for (const middlewareClass of middlewareClasses) {

            if (chainHandler === undefined) {
                chainHandler = eval(`new middlewareClass`);

                nextHandler = chainHandler;

                continue;
            }

            nextHandler.nextHandler = eval(`new middlewareClass`);

            nextHandler = nextHandler.nextHandler;
        }

        return asyncMiddleware(chainHandler.execute);
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
            
            let handlers: Function[] = [];

            if (route.middleware.length > 0) {
                
                const middleware: Function = this.resolveMiddlewareMultiple(route.middleware);
                
                handlers.push(middleware);
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