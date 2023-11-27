import { Request, Response } from 'express';
import CrudController from '../../../Framework/Http/Controller/CrudController';
import UserRepository from '../../Repository/UserRepository';
import AutoBind from '../../../Framework/Decorators/AutoBind';
import BadRequest from '../../../Framework/Exceptions/BadRequest';
import UsersMatchRequest from "../FormRequest/User/UsersMatchRequest";

export default class UserController extends CrudController
{
    private userRepository: UserRepository;

    public constructor() {
        super();
        this.userRepository = new UserRepository;
    }

    @AutoBind
    public async actionMatch(req: Request, res: Response): Promise<void>
    {
        console.log(req.query);

        const form = new UsersMatchRequest(req.query);

        await form.validate();

        if (form.isNotValid()) {

            throw new BadRequest(form.getFirstError());
        }

        const items: object[] = await this.userRepository.getUsersByCondition(form, 20);

        res.json({
            items,
        });
    }

}
