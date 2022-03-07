import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import * as AuthController from '../app/Http/Controllers/AuthController-old';
import * as ValidationManager from '../Framework/Utils/ValidationManager';

const router = Router();

router.put(
    '/signup',
    [
        ValidationManager.validateEmail(),
        ValidationManager.validateName(),
        ValidationManager.validatePassword(),
        ValidationManager.validatePasswordConfirmation(),
    ],
    asyncHandler(AuthController.signup)
);

router.post(
    '/login',
    [
        ValidationManager.validateEmail(false),
        ValidationManager.validatePassword(),
    ],
    asyncHandler(AuthController.login)
);

export default router;