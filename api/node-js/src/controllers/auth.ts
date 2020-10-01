import { RequestHandler, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import * as validationManager from '../utils/validationManager';

import User from '../models/User';

export const signup: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    
    validationManager.provideValidation(req, next);

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });

    return res.status(201)
        .json({
            message: 'success',
        });
}

export const login: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    validationManager.provideValidation(req, next);

    // const user = await User.findByEmail(req.body.email);

    const user = {
        id: null,
        password: null,
    };

    validationManager.provideModelCondition(user, 'Пользователь не найден');

    const isOnMatch = await bcrypt.compare(req.body.password, user.password);

    validationManager.provideAuthentication(isOnMatch);

    const token = validationManager.createUserToken(user);

    return res.json({
        token,
        userId: user.id,
    });
}