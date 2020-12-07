import { Request, Response, NextFunction } from 'express';
import CrudController from './base/CrudController';
import BadRequest from '../core/Exceptions/BadRequest';
import User from '../entity/User';
import UserRepository from '../repository/UserRepository';

export default class UserPermissionsController extends CrudController
{
    protected userRepo: UserRepository;
    
    public constructor()
    {
        super('/user-permissions');
    }

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
    protected async update(req: Request): Promise<object>
    {
        this.defineUserRepo(req);
        
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
