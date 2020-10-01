import { RequestHandler, Request, Response, NextFunction } from 'express';

export const getIndex = (rreq: Request, res: Response, next: NextFunction) => {
    return res.json({
        message: 'Hi there!',
    });
};