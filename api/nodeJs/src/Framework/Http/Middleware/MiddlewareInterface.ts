import { NextFunction, Request, Response } from 'express';

export default interface MiddlewareInterface
{
    useAsync: boolean;

    nextHandler: MiddlewareInterface;

    execute(req: Request, res: Response, next: NextFunction);
}