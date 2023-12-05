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
        return await (new AuthManager()).getUserPermissions(Number(req.params.user_id));
    }
}
