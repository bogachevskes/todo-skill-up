import { Request } from 'express';
import CrudController from '../../../Framework/Http/Controller/CrudController';
import PermissionsRepository from "../../Repository/PermissionsRepository";

export default class UserPermissionsController extends CrudController
{
    private permissionsRepository: PermissionsRepository

    public constructor() {
        super();
        this.permissionsRepository = new PermissionsRepository;
    }

    /**
     * @see CrudController
     */
    protected async list(req: Request): Promise<string[]>
    {
        return this.permissionsRepository.getUserPermissions(Number(req.params.user_id));
    }
}
