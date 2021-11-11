import { NextFunction, Request, Response } from 'express';
import MiddleWareInterface from './MiddlewareInterface';
import AutoBind from '../../../Framework/Decorators/AutoBind';

export default abstract class Middleware implements MiddleWareInterface
{
    /**
     * @type Request
     */
    protected req: Request;

    /**
     * @type Response
     */
    protected res: Response;
    
    /**
     * @return Response|void|never
     */
    protected abstract handle(): Promise<boolean|void|never>;
    
    /**
     * @param  Request req 
     * @param  Response res 
     * @param  NextFunction next 
     * @return void
     */
    @AutoBind
    public async execute(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        this.req = req;

        this.res = res;
        
        const result = await this.handle();

        if (result === false) {
            return;
        }
        
        next();
    }
}