import { NextFunction, Request, Response } from 'express';
import ErrorMiddlewareInterface from './ErrorMiddlewareInterface';
import NotFound from '../../Exceptions/NotFound';
import HTTPException from '../../Exceptions/base/HTTPException';
import InternalServerError from '../../Exceptions/InternalServerError';
import Logger from '../../Utils/Logger';

export default class ErrorMiddleware implements ErrorMiddlewareInterface
{
    /**
     * @see ErrorMiddlewareInterface
     */
    public execute(err: Error, req: Request, res: Response, next: NextFunction): Response
    {
        if (err instanceof NotFound) {
            res.status(err.status);
            
            return res.send({"message": err.message});
        }
    
        if (err instanceof HTTPException) {
            Logger.log('warn', `INNER EXCEPTION => ${err.message}`);
            
            return res.status(err.status)
                .json(err);
        }
    
        Logger.log('error', `Occurred unexpected error => ${err}`);
    
        console.log(err);
    
        const error = new InternalServerError;
    
        return res.status(error.status)
            .json({
                'message': 'Internal server error'
            });
    }
}