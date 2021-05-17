import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import * as authController from '../controllers/auth';
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
    asyncHandler(authController.signup)
);

router.post(
    '/login',
    [
        ValidationManager.validateEmail(false),
        ValidationManager.validatePassword(),
    ],
    asyncHandler(authController.login)
);

export default router;