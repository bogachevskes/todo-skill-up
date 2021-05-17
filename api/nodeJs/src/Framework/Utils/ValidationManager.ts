import { validationResult } from 'express-validator';
import { check } from 'express-validator';
import jwt from 'jsonwebtoken';

import ConfigService from './ConfigService';

import BadRequest from '../Exceptions/BadRequest';
import NotFound from '../Exceptions/NotFound';

import User from '../../app/Entity/User';
import UserRepository from '../../app/Repository/UserRepository';

/**
 * Минимальная длина поля name.
 * @const number
 */
const NAME_MIN_INPUT_LENGTH = 5;

/**
 * Минимальная длина поля password.
 * @const number
 */
const PASSWORD_MIN_INPUT_LENGTH = 5;

/**
 * Обработка валидации данных ввода.
 */
export const provideValidation = (req, _next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return true;
    }

    throw new BadRequest('Данные не валидны', errors.array());
};

/**
 * Обработка наличия аутентификации.
 */
export const provideAuthentication = (condition) => {
    
    if (condition) {
        return;
    }

    throw new BadRequest('Аутентификация не выполнена');
}

/**
 * Обработка наличия аутентификации.
 */
export const provideModelCondition = (condition, errorData = 'Запрашиваемый объект не найден') => {
    
    if (condition) {
        return;
    }

    throw new NotFound(errorData);
}

/**
 * Создает токен для пользователя
 * 
 * @param User user
 * @return string
 */
export const createUserToken = (user: User) => {
    
    const sign = jwt.sign(
        {
            email: user.email,
            userId: user.id,
        },
        String(ConfigService.get('TOKEN_SECRET_WORD')),
        {
            expiresIn: ConfigService.get('TOKEN_EXPIRATION_TIME'),
        }
    );

    return sign;
}

/**
 * Валидация поля email.
 */
export const validateEmail = (checkUnique = true) => {
    const query = check('email')
        .isEmail()
        .withMessage('Проверьте правильность ввода почты.')

        if (! checkUnique) {
            return query;
        }
    
        query.custom(async (value, {req}) => {
            const existingUser = await UserRepository.findByEmail(value);
        
            if (existingUser) {
                throw new Error('Пользователь с такой почтой уже существует');
            }
        })
        .normalizeEmail();

    return query;
}

/**
 * Валидация поля name.
 */
export const validateName = () => {
    return check('name')
        .isLength({min: NAME_MIN_INPUT_LENGTH})
        .withMessage(`Минимальное кол-во символов для имени: ${NAME_MIN_INPUT_LENGTH}`)
        .isAlphanumeric()
        .withMessage('Имя может содержать только буквы и цифры');
}

/**
 * Валидация поля password.
 */
export const validatePassword = () => {
    return check('password')
        .isLength({min: PASSWORD_MIN_INPUT_LENGTH})
        .withMessage(`Минимальное кол-во символов для пароля: ${PASSWORD_MIN_INPUT_LENGTH} chars long`)
        .isAlphanumeric()
        .withMessage('Пароль может содержать только буквы и цифры')
        .trim();
}

/**
 * Валидация подтверждения пароля.
 */
export const validatePasswordConfirmation = () => {
    return check('confirm_password')
        .custom((value, { req }) => {
            
            if (value == req.body.password) {
                return true;
            }

            throw new Error('Введенные пароли должны совпадать');
        })
        .trim();
}