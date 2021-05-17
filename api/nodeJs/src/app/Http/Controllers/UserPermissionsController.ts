import { Request, Response, NextFunction } from 'express';
import CrudController from '../../../Framework/Http/Controller/CrudController';
import BadRequest from '../../../Framework/Exceptions/BadRequest';
import User from '../../Entity/User';
import UserRepository from '../../../app/Repository/UserRepository';

export default class UserPermissionsController extends CrudController
{
    protected userRepo: UserRepository;

    /**
     * Определение репозитория пользователя.
     * 
     * @param  Request req
     * @return void
     */
    protected defineUserRepo(req: Request): void
    {
        if (! (req['user'] instanceof User)) {
            throw new BadRequest('Пользователь не определен');
        }

        this.userRepo = new UserRepository(req['user']);
    }

    /**
     * @see CrudController
     */
    protected async list(req: Request): Promise<string[]>
    {
        this.defineUserRepo(req);

        const permissions = await this.userRepo.getPermissionNames();

        return new Promise(resolve => resolve(permissions));
    }

    /**
     * @see CrudController
     */
    protected async create(req: Request): Promise<object>
    {
        this.defineUserRepo(req);
        
        return new Promise(function(resolve, reject) {
            return resolve({});
        });
    }

    /**
     * @see CrudController
     */
    protected async update(id: number, req: Request): Promise<object>
    {
        this.defineUserRepo(req);
        
        return new Promise(function(resolve, reject) {
            return resolve({});
        });
    }

    /**
     * @see CrudController
     */
    protected async delete(id: number, req: Request): Promise<boolean>
    {
        // Not implemented
        return new Promise(function(resolve, reject) {
            return resolve(true);
        });
    }

}
