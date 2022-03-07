import Controller from '../../../Framework/Http/Controller/Controller';
import {Request, Response, NextFunction } from 'express';

export default class AuthController extends Controller
{
    /**
     * @param  Request req 
     * @param  Response res 
     * @param  NextFunction next 
     * @return Promise<Response>
     */
    public async actionLogin(req: Request, res: Response, next: NextFunction): Promise<Response>
    {
        return res.json({
            message: 'Hi there!',
        });
    };
}