import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import * as authController from '../controllers/auth';
import * as validationManager from '../utils/validationManager';

const router = Router();

router.put(
    '/signup',
    [
        validationManager.validateEmail(),
        validationManager.validateName(),
        validationManager.validatePassword(),
        validationManager.validatePasswordConfirmation(),
    ],
    asyncHandler(authController.signup)
);

router.post(
    '/login',
    [
        validationManager.validateEmail(false),
        validationManager.validatePassword(),
    ],
    asyncHandler(authController.login)
);

export default router;