import { NextFunction, Request, Response } from 'express';
import ErrorMiddlewareInterface from './ErrorMiddlewareInterface';
import NotFound from '../../Exceptions/NotFound';
import Logger from '../../Utils/Logger';
import Codes from '../../Exceptions/base/Codes';
import BadRequest from "../../Exceptions/BadRequest";
import Unauthorized from "../../Exceptions/Unauthorized";
import Forbidden from "../../Exceptions/Forbidden";
import Messages from "../../Exceptions/base/Messages";

export default class ErrorMiddleware implements ErrorMiddlewareInterface
{
    /**
     * @see ErrorMiddlewareInterface
     */
    public execute(err: Error, req: Request, res: Response, next: NextFunction): Response
    {
        if (err instanceof NotFound) {
            res.status(Codes.CODE_NOT_FOUND);
            
            return res.json(err);
        }

        if (err instanceof BadRequest) {
            res.status(Codes.CODE_BAD_REQUEST);

            return res.json(err);
        }

        if (err instanceof Unauthorized) {
            res.status(Codes.CODE_UNAUTHORIZED);

            return res.json(err);
        }

        if (err instanceof Forbidden) {
            res.status(Codes.CODE_FORBIDDEN);

            return res.json(err);
        }
    
        Logger.log('error', `Occurred unexpected error => ${err}`);
    
        console.log(err);

        return res.status(Codes.CODE_INTERNAL_SERVER_ERROR)
            .json({
                'message': Messages.INTERNAL_SERVER_ERROR,
            });
    }
}