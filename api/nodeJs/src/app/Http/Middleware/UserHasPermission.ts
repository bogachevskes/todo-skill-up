import Middleware from "../../../Framework/Http/Middleware/Middleware";
import {Request, Response} from "express";
import PermissionsRepository from "../../Repository/PermissionsRepository";
import Forbidden from "../../../Framework/Exceptions/Forbidden";

export default class UserHasPermission extends Middleware
{
    private permissionsRepository: PermissionsRepository;

    public constructor(
        private readonly permissionName: string,
    )
    {
        super();
        this.permissionName = permissionName;
        this.permissionsRepository = new PermissionsRepository();
    }

    protected async handle(req: Request, res: Response): Promise<void>
    {
        const userId = Number(req['user'].id);

        if (await this.permissionsRepository.userHasPermission(this.permissionName, userId) === false) {
            throw new Forbidden('Нет доступа');
        }
    }

}