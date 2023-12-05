import { Request } from 'express';
import CrudController from '../../../../Framework/Http/Controller/CrudController';
import UserRepository from '../../../Repository/UserRepository';
import BadRequest from '../../../../Framework/Exceptions/BadRequest';
import NotFound from "../../../../Framework/Exceptions/NotFound";
import User from "../../../Entity/User";
import UserUpdateRequest from "../../FormRequest/User/UserUpdateRequest";
import UserCreateRequest from "../../FormRequest/User/UserCreateRequest";

export default class AdminUserController extends CrudController
{
    protected userRepository: UserRepository;

    public constructor() {
        super();
        this.userRepository = new UserRepository;
    }
    
    /**
     * @see CrudController
     */
    protected async list(): Promise<object[]>
    {
        return await this.userRepository.allExisting();
    }

    protected async listItem(id: number, req: Request): Promise<object>
    {
        const user: User = await this.findModel(id);

        return Object.assign({}, user);
    }

    /**
     * @see CrudController
     */
    protected async create(req: Request): Promise<void>
    {
        const form: UserCreateRequest = new UserCreateRequest(req.body.formData);

        await form.validate();

        if (form.isNotValid()) {
            throw new BadRequest(form.getFirstError());
        }

        await this.userRepository.createNew(form.getAttributes());
    }

    /**
     * @see CrudController
     */
    protected async update(id: number, req: Request, patch: boolean = false): Promise<void>
    {
        const user: User = await this.findModel(id);

        const form: UserUpdateRequest = new UserUpdateRequest(req.body.formData);

        form.skipMissingProperties = patch;

        await form.validate();

        if (form.isNotValid()) {
            throw new BadRequest(form.getFirstError());
        }

        await this.userRepository.update(user, form.getFilledAttributes());
    }

    protected async patch(id: number, req: Request): Promise<void>|never
    {
        await this.update(id, req, true);
    }

    /**
     * @see CrudController
     */
    protected async delete(id: number, req: Request): Promise<void>
    {
        const user: User = await this.findModel(id);

        await this.userRepository.delete(user);
    }

    protected async findModel(id: number): Promise<User | never>
    {
        const model: User | null = await this.userRepository.findById(id);

        if (model instanceof User) {
            return model;
        }

        throw new NotFound('Пользователь не найден');
    }
}
