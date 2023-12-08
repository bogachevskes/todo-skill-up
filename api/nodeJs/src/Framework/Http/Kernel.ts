import express from 'express';
import { json as bodyParserJson } from 'body-parser';
import { asyncMiddleware } from 'middleware-async';
import Router from './Router/Router';
import OutputManager from '../Helpers/OutputManager';
import MiddlewareInterface from './Middleware/MiddlewareInterface';
import ErrorMiddlewareInterface from './Middleware/ErrorMiddlewareInterface';
import NotFound from '../Exceptions/NotFound';

export default class Kernel
{
    protected app: express.Express;

    protected router: Router;

    protected middleware: MiddlewareInterface[] = [];

    protected errorMiddleware: ErrorMiddlewareInterface[] = [];

    public setMiddleware(middleware: MiddlewareInterface[]): void
    {
        this.middleware = middleware;
    }

     public setErrorMiddleware(middleware: ErrorMiddlewareInterface[]): void
     {
        this.errorMiddleware = middleware;
     }

    public setRouter(router: Router): void
    {
        this.router = router;
    }

    protected applyMiddleware(): void
    {
        for (const middleware of this.middleware) {
            
            if (middleware.useAsync === true) {
                this.app.use(asyncMiddleware(middleware.execute));

                continue;
            }
            
            this.app.use(middleware.execute);
        }
    }

    protected applyErrorMiddleware(): void
    {
        for (const middleware of this.errorMiddleware) {
            this.app.use(middleware.execute);
        }
    }

    public async handle(port: number): Promise<void>
    {
        this.app = await express();

        this.app.use(bodyParserJson());

        this.applyMiddleware();

        this.app.use(this.router.getRoutes());

        this.app.use('*', function() {
            throw new NotFound('The requested page does not exists');
        });

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