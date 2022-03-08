import { Request, Response } from 'express';
import CommandContext from '../../../Framework/Base/CommandContext';
import Controller from '../../../Framework/Http/Controller/Controller';
import ValidationError from '../../../Framework/Exceptions/ValidationError';
import BadRequest from '../../../Framework/Exceptions/BadRequest';

import UserLogin from '../../Console/Commands/UserLogin';
import UserCreate from '../../Console/Commands/UserCreate';

export default class AuthController extends Controller
{
    /**
     * @param  Request req 
     * @param  Response res 
     * @return Promise<Response> | never
     */
    public async actionLogin(req: Request, res: Response): Promise<Response> | never
    {
        const context = new CommandContext;

        for (const key in req.body) {
            context.set(key, req.body[key]);
        }

        const cmd = new UserLogin;

        try {

            await cmd.execute(context);

        } catch (error) {

            if (error instanceof ValidationError) {
                
                throw new BadRequest(error.message);
            }

            throw error;
        } 
        
        return res.json(context.get('access'));
    };

    /**
     * @param  Request req 
     * @param  Response res 
     * @return Promise<Response> | never
     */
    public async actionSignup(req: Request, res: Response): Promise<Response> | never
    {
        const context = new CommandContext;

        for (const key in req.body) {
            context.set(key, req.body[key]);
        }

        const cmd = new UserCreate;

        try {

            await cmd.execute(context);

        } catch (error) {

            if (error instanceof ValidationError) {
                
                throw new BadRequest(error.message);
            }

            throw error;
        } 
        
        return res.json({
            message: 'success',
        });
    }
}