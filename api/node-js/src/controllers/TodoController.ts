import { Request, Response, NextFunction } from 'express';
import CrudController from './base/CrudController';
import RouteData from './base/RouteData';

export default class TodoController extends CrudController
{
    public constructor()
    {
        super('/todo');
    }

    /**
     * @see CrudController
     */
    protected async list(req: Request, res: Response): Promise<object[]>
    {
        return new Promise(function(resolve, reject) {
            resolve([{}]);
        });
    }

    /**
     * @see CrudController
     */
    protected async create(req: Request, res: Response): Promise<object>
    {
        return new Promise(function(resolve, reject) {
            return resolve({});
        });
    }

    /**
     * @see CrudController
     */
    protected async update(req: Request, res: Response): Promise<object>
    {
        return new Promise(function(resolve, reject) {
            return resolve({});
        });
    }

    /**
     * @see CrudController
     */
    protected async delete(req: Request, res: Response): Promise<boolean>
    {
        return new Promise(function(resolve, reject) {
            return resolve(true);
        });
    }

}
