import CrudController from "../../../Framework/Http/Controller/CrudController";
import {Request} from "express";
import PermissionsRepository from "../../Repository/PermissionsRepository";

export default class BoardsPermissionsController extends CrudController
{
    protected permissionsRepository: PermissionsRepository;

    public constructor() {
        super();
        this.permissionsRepository = new PermissionsRepository;
    }

    protected async list(req: Request): Promise<string[]>
    {
        return await this.permissionsRepository.getBoardsPermissions();
    }
}