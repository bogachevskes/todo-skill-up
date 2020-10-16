import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserRepository from '../repository/UserRepository';

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-BASE-AUTH');

    next();
};

/**
 * Фильтрация доступа только
 * авторизованных пользователей.
 */
export const authOnly = async (req: Request, res: Response, next: NextFunction) => {
    
    const token  = req.get('X-BASE-AUTH');

    validationManager.provideAuthentication(token);
    
    let decodedToken;

    decodedToken = jwt.verify(token!, commonConfig.TOKEN_SECRET_WORD);

    validationManager.provideAuthentication(decodedToken);

    const user = await UserRepository.findById(decodedToken.userId);

    validationManager.provideModelCondition(user);

    req['user'] = user;
    
    return next();
};
