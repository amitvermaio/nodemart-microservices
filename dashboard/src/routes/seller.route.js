import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
const router = Router();

router.use(authenticate([ 'seller' ]));

router.get('/metrics', () => {});

export default router;