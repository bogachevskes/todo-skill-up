import { NextFunction, Request, Response } from 'express';
import { json as bodyParserJson } from 'body-parser';
import { NextHandleFunction } from 'connect';
import MiddlewareInterface from './MiddlewareInterface';

export default class JsonParserMiddleware implements MiddlewareInterface
{
    /**
     * @see MiddlewareInterface
     */
    public execute(req: Request, res: Response, next: NextFunction): NextHandleFunction
    {
        return bodyParserJson();
    }
}