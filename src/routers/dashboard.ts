import { Router, Request, Response } from 'express';
import { ensureAuthenticated } from '../middlewares/auth';

const router = Router();

router.get('/', ensureAuthenticated, (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to your dashboard!',
    user: req.user,
  });
});

export default router;