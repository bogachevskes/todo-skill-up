import { Request, Response, NextFunction } from 'express';
import Controller from './Controller';
import Route from '../Router/Route';
import AutoBind from '../../Decorators/AutoBind';
import * as _ from 'lodash';

export default abstract class CrudController extends Controller
{
    /**
     * @param  Request req
     * @return Promise<object[]>
     */
    protected abstract list(req: Request): Promise<any[]>

    /**
     * @param  Request req
     * @return Promise<object>
     */
    protected abstract create(req: Request): Promise<object>

    /**
     * @param  number id
     * @param  Request req
     * @return Promise<object>
     */
    protected abstract update(id: number, req: Request): Promise<object>

    /**
     * @param  number id
     * @param  Request req
     * @return Promise<boolean>
     */
    protected abstract delete(id: number, req: Request): Promise<boolean>

    /**
     * Определяет дополнительные роуты.
     * 
     * @return Route[]
     */
    protected defineCustomRoutes(): Route[]
    {
        return [

        ];
    }

    /**
     * Возвращает роуты по умолчанию.
     * 
     * @return Route[]
     */
    protected defineDefaultRoutes(): Route[]
    {
        return [
            //new Route('get', 'list'),
            //new Route('post', 'create'),
            //new Route('put', 'update/:id', 'update'),
            //new Route('delete', 'delete/:id', 'delete'),
        ];
    }
    
    /**
     * @see Controller
     */
    protected defineRoutes(): Route[]
    {
        return _.concat(
            this.defineDefaultRoutes(),
            this.defineCustomRoutes()
        );
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
        const id = parseInt(req.params.id);
        
        return res.json({
            item: await this.update(id, req),
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
        const id = parseInt(req.params.id);
        
        return res.json({
            success: await this.delete(id, req),
        });
    }

}
