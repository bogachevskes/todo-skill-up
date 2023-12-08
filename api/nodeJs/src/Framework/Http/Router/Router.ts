import { Router as BaseRouter } from 'express';
import asyncHandler from 'express-async-handler';
import { asyncMiddleware } from 'middleware-async';
import Route from './Route';

export default class Router
{
    protected router;

    protected routes: Route[];
    
    public constructor()
    {
        this.router = BaseRouter();
    }

    protected resolveMiddlewareMultiple(middlewares: Function[]|object[]): Function
    {
        let chainHandler,
            nextHandler;
        
        for (const middleware of middlewares) {

            if (chainHandler === undefined) {
                chainHandler = typeof middleware === 'object' ? middleware : eval(`new middleware`);

                nextHandler = chainHandler;

                continue;
            }

            nextHandler.nextHandler = typeof middleware === 'object' ? middleware : eval(`new middleware`);

            nextHandler = nextHandler.nextHandler;
        }

        return asyncMiddleware(chainHandler.execute);
    }

    protected resolveController(controllerClass: Function, action: string)
    {
        const controller: object = eval(`new controllerClass`);

        return asyncHandler(controller[action].bind(controller));
    }

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

    public getRoutes(): BaseRouter
    {
        return this.router;
    }
}