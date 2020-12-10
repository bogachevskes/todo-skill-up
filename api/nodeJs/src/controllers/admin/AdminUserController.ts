import { Request, Response, NextFunction } from 'express';
import CrudController from '../base/CrudController';
import UserRepository from '../../repository/UserRepository';

export default class AdminUserController extends CrudController
{
    public constructor()
    {
        super('/admin/users');
    }
    
    /**
     * @see CrudController
     */
    protected async list(): Promise<object[]>
    {
        return await UserRepository.all();
    }

    /**
     * @see CrudController
     */
    protected async create(req: Request): Promise<object>
    {
        return new Promise(function(resolve, reject) {
            return resolve({});
        });
    }

    /**
     * @see CrudController
     */
    protected async update(req: Request): Promise<object>
    {
        return new Promise(function(resolve, reject) {
            return resolve({});
        });
    }

    /**
     * @see CrudController
     */
    protected async delete(req: Request): Promise<boolean>
    {
        // Not implemented
        return new Promise(function(resolve, reject) {
            return resolve(true);
        });
    }
}