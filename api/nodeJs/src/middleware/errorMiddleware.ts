import { NextFunction, Request, Response } from 'express';
import NotFound from '../core/Exceptions/NotFound';
import HTTPException from '../core/Exceptions/base/HTTPException';
import InternalServerError from '../core/Exceptions/InternalServerError';
import logger from '../utils/logger';

export default (err: Error, req: Request, res: Response, next: NextFunction): Response<any> => {
    if (err instanceof NotFound) {
        res.status(err.status);
        
        return res.send(err);
    }

    if (err instanceof HTTPException) {
        logger.log('warn', `INNER EXCEPTION => ${err.message}`);
        
        return res.status(err.status)
            .json(err);
    }

    logger.log('error', `Occurred unexpected error => ${err}`);

    console.log(err);

    const error = new InternalServerError;

    return res.status(error.status)
        .json(err);
};
