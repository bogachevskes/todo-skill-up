import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import BadRequest from '../core/Exceptions/BadRequest';
import NotFound from '../core/Exceptions/NotFound';

import UserRepository from '../repository/UserRepository';

import User from '../entity/User';

import commonConfig from '../config/_common';
import * as validationManager from '../utils/validationManager';

/**
 * Действия по умолчанию.
 */
export const executeDefaults = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.path);
    next();
};

/**
 * Добавление возможности создания
 * кросс-доменных запросов к приложению.
 */
export const provideCORS = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-BASE-AUTH');

    if ('OPTIONS' == req.method) {
        res.sendStatus(204);

        return;
    }
    
    next();
};

/**
 * Фильтрация доступа только
 * авторизованных пользователей.
 */
export const authOnly = async (req: Request, res: Response, next: NextFunction) => {
    
    const token: string = String(req.get('X-BASE-AUTH'));
    
    let decodedToken;

    decodedToken = jwt.verify(token!, commonConfig.TOKEN_SECRET_WORD);

    validationManager.provideAuthentication(decodedToken);

    const user = await UserRepository.findById(decodedToken.userId);

    if (! (user instanceof User)) {
        throw new NotFound('Пользователь не найден');
    }

    if (UserRepository.isBlocked(user)) {
        throw new BadRequest('Пользователь заблокирован');
    }

    req['user'] = user;
    
    next();
};
