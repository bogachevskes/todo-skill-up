import { Request, Response, NextFunction } from 'express';
import Controller from './base/Controller';
import RouteData from './base/RouteData';

export default class TodoController extends Controller
{
    public constructor()
    {
        super('/todo');
        this.initializeRoutes();
    }

    protected defineRoutes(): RouteData[]
    {
        return [
            new RouteData('get', 'list'),
        ];
    }
    
    public async actionList(req: Request, res: Response): Promise<Response>
    {
        return res.json({
            items: {},
        });
    }
}