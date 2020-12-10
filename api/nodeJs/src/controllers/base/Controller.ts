import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import RouteData from './RouteData';
import CaseHelper from '../../utils/CaseHelper';

export default abstract class Controller
{
    /**
     * @var string
     */
    protected path: string;

    /**
     * @var Router
     */
    protected router: Router;
   
    public constructor(path: string) {
        this.path   = path;
        this.router = Router();
        
        this.initializeRoutes();
    }

    /**
     * @return string
     */
    public getPath(): string
    {
        return this.path;
    }

    /**
     * @return Router
     */
    public getRouter(): Router
    {
        return this.router;
    }

    /**
     * Объявление роутов.
     * 
     * @return RouteData[]
     */
    protected abstract defineRoutes(): RouteData[];

    /**
     * Объявление пути запроса
     * 
     * @param  string path
     * @return string
     */
    protected definePath(path: string): string
    {
        return `/${path}`;
    }

    /**
     * Определение метода обработки.
     * 
     * @param  string action 
     * @return string
     */
    protected defineAction(action: string): string
    {
        return `action${CaseHelper.capitalize(action)}`;
    }

    /**
     * Инициализация роутов.
     * 
     * @return void
     */
    public initializeRoutes(): void
    {
        const routes: RouteData[] = this.defineRoutes();
        
        routes.forEach((controller: RouteData) => {
            const
                action  = this.defineAction(controller.action),
                path    = this.definePath(controller.path);

            this.router[controller.method](path, asyncHandler(this[action]));
        });
    }

}