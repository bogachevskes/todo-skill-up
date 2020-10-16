import { RequestHandler, Request, Response, NextFunction } from 'express';

export const getIndex = (req: Request, res: Response, next: NextFunction) => {
    return res.json({
        message: 'Hi there!',
    });
};