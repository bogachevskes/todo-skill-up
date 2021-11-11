import { NextFunction, Request, Response } from 'express';

export default interface MiddlewareInterface
{
    /**
     * @param Request req 
     * @param Response res 
     * @param NextFunction next 
     */
    execute(req: Request, res: Response, next: NextFunction);
}