import { Request, Response, NextFunction } from 'express';
import Controller from './Controller';
import RouteData from './RouteData';
import AutoBind from '../../core/Decorators/AutoBind';

export default abstract class CrudController extends Controller
{
    /**
     * @param req
     * @return Promise<object[]>
     */
    protected abstract async list(req: Request): Promise<object[]>

    /**
     * @param req
     * @return Promise<object>
     */
    protected abstract async create(req: Request): Promise<object>

    /**
     * @param req
     * @return Promise<object>
     */
    protected abstract async update(req: Request): Promise<object>

    /**
     * @param req
     * @return Promise<boolean>
     */
    protected abstract async delete(req: Request): Promise<boolean>
    
    /**
     * @see Controller
     */
    protected defineRoutes(): RouteData[]
    {
        return [
            new RouteData('get', 'list'),
            new RouteData('post', 'create'),
            new RouteData('put', 'update'),
            new RouteData('delete', 'delete'),
        ];
    }

    /**
     * Возвращает сущности.
     * 
     * @param  req 
     * @param  res
     * @return Response
     */
    @AutoBind
    public async actionList(req: Request, res: Response): Promise<Response>
    {
        return res.json({
            items: await this.list(req),
        });
    }

    /**
     * Создает сущность.
     * 
     * @param  req 
     * @param  res
     * @return Response
     */
    @AutoBind
    public async actionCreate(req: Request, res: Response): Promise<Response>
    {
        return res.json({
            item: await this.create(req),
        });
    }

    /**
     * Обновление сущности.
     * 
     * @param  req 
     * @param  res
     * @return Response
     */
    @AutoBind
    public async actionUpdate(req: Request, res: Response): Promise<Response>
    {
        return res.json({
            item: await this.update(req),
        });
    }

    /**
     * Удаление сущности.
     * 
     * @param  req 
     * @param  res
     * @return Response
     */
    @AutoBind
    public async actionDelete(req: Request, res: Response): Promise<Response>
    {
        return res.json({
            success: await this.delete(req),
        });
    }

}
