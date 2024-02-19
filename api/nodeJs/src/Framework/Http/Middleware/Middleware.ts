import { NextFunction, Request, Response } from 'express';
import MiddlewareInterface from './MiddlewareInterface';
import AutoBind from '../../../Framework/Decorators/AutoBind';

export default abstract class Middleware implements MiddlewareInterface
{
    /**
     * @see MiddleWareInterface
     */
    public useAsync: boolean = true;

    /**
     * @var MiddlewareInterface | null
     */
    public nextHandler: MiddlewareInterface;
    
    /**
     * @return Response|void|never
     */
    protected abstract handle(req: Request, res: Response): Promise<boolean|void|never>;
    
    /**
     * @param  Request req 
     * @param  Response res 
     * @param  NextFunction next 
     * @return void
     */
    @AutoBind
    public async execute(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        const result = await this.handle(req, res);

        if (result === false) {
            
            return;
        }

        if (this.nextHandler !== undefined && 'execute' in this.nextHandler) {

            await this.nextHandler.execute(req, res, next);
        }

        next();
    }
}