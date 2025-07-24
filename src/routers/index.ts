import { Router } from 'express';
import authRouter from './auth';
import dashboardRouter from './dashboard';
import userRouter from './user';
import { checkSessionBlacklist } from '../middlewares/sessionBlacklist';

const router = Router();

router.use(checkSessionBlacklist);
router.use('/auth', authRouter);
router.use('/dashboard', dashboardRouter);
router.use('/users', userRouter);

export default router;