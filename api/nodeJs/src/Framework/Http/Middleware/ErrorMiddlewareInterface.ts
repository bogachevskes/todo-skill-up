import { NextFunction, Request, Response } from 'express';

export default interface ErrorMiddlewareInterface
{
    /**
     * @param Error err 
     * @param Request req 
     * @param Response res 
     * @param NextFunction next 
     */
    execute(err: Error, req: Request, res: Response, next: NextFunction);
}