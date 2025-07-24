import { Router, Request, Response } from 'express';
import { ensureAuthenticated } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Access user dashboard
 *     description: Get dashboard information for authenticated users
 *     tags: [Dashboard]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Dashboard accessed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Welcome to your dashboard!'
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', ensureAuthenticated, (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to your dashboard!',
    user: req.user,
  });
});

export default router;