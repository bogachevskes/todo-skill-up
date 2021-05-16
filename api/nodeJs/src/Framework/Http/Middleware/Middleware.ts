import { NextFunction, Request, Response } from 'express';
import MiddleWareInterface from './MiddleWareInterface';

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
    protected abstract handle(): Response|void|never;
    
    /**
     * @param  Request req 
     * @param  Response res 
     * @param  NextFunction next 
     * @return void
     */
    public execute(req: Request, res: Response, next: NextFunction): void
    {
        this.req = req;

        this.res = res;
        
        const result = this.handle();

        if (result instanceof Response) {
            return;
        }
        
        next();
    }
}