import { Request } from 'express';
import CrudController from '../../../Framework/Http/Controller/CrudController';
import AuthManager from "../../Components/AuthManager";

export default class UserPermissionsController extends CrudController
{
    /**
     * @see CrudController
     */
    protected async list(req: Request): Promise<string[]>
    {
        const authManager: AuthManager = new AuthManager();

        return await authManager.getUserPermissions(req['user'].id);
    }

    /**
     * @see CrudController
     */
    protected async create(req: Request): Promise<object>
    {
        // Not implemented

        return new Promise(function(resolve, reject) {
            return resolve({});
        });
    }

    /**
     * @see CrudController
     */
    protected async update(id: number, req: Request): Promise<object>
    {
        // Not implemented

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
