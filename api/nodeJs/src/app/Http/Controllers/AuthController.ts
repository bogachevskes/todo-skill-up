import { Request, Response } from 'express';
import CommandContext from '../../../Framework/Base/CommandContext';
import BadRequest from '../../../Framework/Exceptions/BadRequest';
import UserLogin from '../../Commands/UserLogin';
import UserCreateRequest from "../FormRequest/User/UserCreateRequest";
import UserRepository from "../../Repository/UserRepository";
import UserLoginRequest from "../FormRequest/User/UserLoginRequest";
import User from "../../Entity/User";
import Codes from "../../../Framework/Exceptions/base/Codes";

export default class AuthController
{
    protected userRepository: UserRepository;

    public constructor() {
        this.userRepository = new UserRepository;
    }

    public async actionLogin(req: Request, res: Response): Promise<Response> | never
    {
        const form: UserLoginRequest =  new UserLoginRequest(req.body.formData);

        await form.validate();

        if (form.isNotValid()) {
            throw new BadRequest(form.getFirstError());
        }

        const user: User|null = await this.userRepository.findByEmail(form.email);

        if (user === null) {
            throw new BadRequest('Пользователь не найден');
        }

        if (this.userRepository.isBlocked(user)) {
            throw new BadRequest('Пользователь заблокирован');
        }

        const context = new CommandContext;

        const cmd = new UserLogin();

        context.set('user', user);

        await cmd.execute(context);

        res.status(Codes.CODE_CREATED);
        
        return res.json(context.get('access'));
    };

    public async actionSignup(req: Request, res: Response): Promise<void> | never
    {
        const form: UserCreateRequest = new UserCreateRequest(req.body.formData);

        await form.validate();

        if (form.isNotValid()) {
            throw new BadRequest(form.getFirstError());
        }

        await this.userRepository.createNew(form.getAttributes());

        res.send();
    }
}