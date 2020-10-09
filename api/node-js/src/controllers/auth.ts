import { RequestHandler, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import * as validationManager from '../utils/validationManager';

import UserRepository from '../repository/UserRepository';

export const signup: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    
    validationManager.provideValidation(req, next);

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    await UserRepository.createNew(req.body.name, req.body.email, hashedPassword);

    return res.status(201)
        .json({
            message: 'success',
        });
}

export const login: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    validationManager.provideValidation(req, next);

    const user = await UserRepository.findByEmail(req.body.email);

    validationManager.provideModelCondition(user, 'Пользователь не найден');

    const isOnMatch = await bcrypt.compare(req.body.password, user!.password);

    validationManager.provideAuthentication(isOnMatch);

    const token = validationManager.createUserToken(user!);

    return res.json({
        token: token,
        userId: user!.id,
    });
}