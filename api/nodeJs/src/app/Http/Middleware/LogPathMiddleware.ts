import { Request } from 'express';
import Middleware from '../../../Framework/Http/Middleware/Middleware';

export default class LogPathMiddleware extends Middleware
{
    /**
     * @see Middleware
     */
    protected async handle(req: Request): Promise<void>
    {
        console.log(`${req.method}: ${req.path}`);
    }
}