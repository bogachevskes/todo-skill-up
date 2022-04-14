import { Request, Response } from 'express';
import Middleware from './Middleware';

/**
 * Добавление возможности создания
 * кросс-доменных запросов к приложению.
 */
export default class ProvideCorsMiddleware extends Middleware
{
    /**
     * @see Middleware
     */
    protected async handle(req: Request, res: Response): Promise<boolean|void>
    {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-BASE-AUTH');
    
        if (req.method === 'OPTIONS') {
            res.sendStatus(204);
    
            return false;
        }
    }
}