import { RequestHandler, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import * as ValidationManager from '../../../Framework/Utils/ValidationManager';

import BadRequest from '../../../Framework/Exceptions/BadRequest';
import NotFound from '../../../Framework/Exceptions/NotFound';

import UserRepository from '../../Repository/UserRepository';
import User from '../../Entity/User';

export const signup: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    
    ValidationManager.provideValidation(req, next);

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    await UserRepository.createNew(req.body.name, req.body.email, hashedPassword);

    return res.status(201)
        .json({
            message: 'success',
        });
}

export const login: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    ValidationManager.provideValidation(req, next);

    const user = await UserRepository.findByEmail(req.body.email);

    if (! (user instanceof User)) {
        throw new NotFound('Пользователь не найден');
    }

    if (UserRepository.isBlocked(user)) {
        throw new BadRequest('Пользователь заблокирован');
    }

    const isOnMatch = await bcrypt.compare(req.body.password, user!.password);

    ValidationManager.provideAuthentication(isOnMatch);

    const token = ValidationManager.createUserToken(user!);

    return res.json({
        token: token,
        userId: user!.id,
    });

}
