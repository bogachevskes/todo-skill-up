import { Router } from 'express';
import * as siteController from '../controllers/site';

const router = Router();

router.get('/', siteController.getIndex);

export default router;