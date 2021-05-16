import { NextFunction, Request, Response } from 'express';

export default interface MiddleWareInterface
{
    execute(req: Request, res: Response, next: NextFunction);
}