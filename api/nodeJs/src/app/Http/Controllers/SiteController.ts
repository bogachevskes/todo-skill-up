import Controller from '../../../Framework/Http/Controller/Controller';
import {Request, Response, NextFunction } from 'express';

export default class SiteController extends Controller
{
    public async actionIndex(_req: Request, res: Response, _next: NextFunction): Promise<Response>
    {
        return res.json({
            message: 'Hi there!',
        });
    };

    public async actionHi(_req: Request, res: Response, _next: NextFunction): Promise<Response>
    {
        return res.json({
            message: 'Hi!',
        });
    };
}



