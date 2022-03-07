import Controller from '../../../Framework/Http/Controller/Controller';
import {Request, Response } from 'express';
import LoginRequest from '../../FormRequest/Auth/LoginRequest';
import BadRequest from '../../../Framework/Exceptions/BadRequest';
import UserRepository from '../../Repository/UserRepository';
import User from '../../Entity/User';
import ConfigService from '../../../Framework/Utils/ConfigService';
import jwt from 'jsonwebtoken';

export default class AuthController extends Controller
{
    /**
     * @param  Request req 
     * @param  Response res 
     * @param  NextFunction next 
     * @return Promise<Response> | never
     */
    public async actionLogin(req: Request, res: Response): Promise<Response> | never
    {
        const formRequest = new LoginRequest(req.body);

        console.log(req.body, formRequest);

        await formRequest.validate();

        if (formRequest.isNotValid()) {
            throw new BadRequest(formRequest.getFirstError());
        }

        const user = await UserRepository.findByEmail(formRequest.email);

        if ((user instanceof User) && UserRepository.isBlocked(user)) {
            throw new BadRequest('Пользователь заблокирован');
        }

        const token = jwt.sign(
            {
                email: user!.email,
                userId: user!.id,
            },
            String(ConfigService.get('TOKEN_SECRET_WORD')),
            {
                expiresIn: ConfigService.get('TOKEN_EXPIRATION_TIME'),
            }
        );
        
        return res.json({
            token: token,
            userId: user!.id,
        });
    };
}