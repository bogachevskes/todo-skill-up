import express from 'express';
import { asyncMiddleware } from 'middleware-async';
import Router from './Router/Router';
import OutputManager from '../Helpers/OutputManager';
import MiddlewareInterface from './Middleware/MiddlewareInterface';
import ErrorMiddlewareInterface from './Middleware/ErrorMiddlewareInterface';

export default class Kernel
{
    /**
     * @type express.Express
     */
    protected app: express.Express;
    
    /**
     * @type Router
     */
    protected router: Router;

    /**
     * @type MiddlewareInterface[]
     */
    protected middleware: MiddlewareInterface[];

    /**
     * @post ErrorMiddlewareInterface[]
     */
    protected errorMiddleware: ErrorMiddlewareInterface[];

    /**
     * @param  MiddlewareInterface[] middleware 
     * @return void
     */
    public setMiddleware(middleware: MiddlewareInterface[]): void
    {
        this.middleware = middleware;
    }

    /**
     * @param  ErrorMiddlewareInterface[] middleware 
     * @return void
     */
     public setErrorMiddleware(middleware: ErrorMiddlewareInterface[]): void
     {
        this.errorMiddleware = middleware;
     }
    
    /**
     * @param  router 
     * @return void
     */
    public setRouter(router: Router): void
    {
        this.router = router;
    }

    /**
     * @return void
     */
    protected applyMiddleware(): void
    {
        for (const middleware of this.middleware) {
            this.app.use(asyncMiddleware(middleware.execute));
        }
    }

    /**
     * @return void
     */
    protected applyErrorMiddleware(): void
    {
        for (const middleware of this.errorMiddleware) {
            this.app.use(middleware.execute);
        }
    }
    
    /**
     * @param  number port 
     * @return Promise<void>
     */
    public async handle(port: number): Promise<void>
    {
        this.app = await express();

        this.applyMiddleware();

        this.app.use(this.router.getRoutes());

        this.applyErrorMiddleware();

        this.app.listen(port, () => OutputManager.showServerInit(port));
    }

    /**
     * Завершение выполнения команды.
     * 
     * @return void
     */
    public terminate(): void
    {
        process.exit();
    }
}