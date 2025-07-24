import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/auth';

const router = Router();

router.get('/', ensureAuthenticated, (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to your dashboard!',
    user: req.user,
  });
});

export default router; 