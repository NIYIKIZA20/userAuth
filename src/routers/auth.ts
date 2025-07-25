import { Router } from 'express';
import passport from '../middlewares/passport'
import { addToBlacklist } from '../utils/sessionBlacklist';

const router = Router();

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Start Google OAuth authentication
 *     description: Redirects user to Google OAuth consent screen to begin authentication process
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth consent screen
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback handler
 *     description: Handles the callback from Google OAuth and processes user authentication
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: State parameter for security
 *     responses:
 *       302:
 *         description: Successful authentication - redirect to dashboard
 *       401:
 *         description: Authentication failed - redirect to home
 *       500:
 *         description: Server error
 */
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/api/dashboard');
  }
);

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout user
 *     description: Logs out the current user, destroys session, and adds session to blacklist
 *     tags: [Authentication]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       302:
 *         description: Successfully logged out - redirect to home
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/logout', (req, res) => {
  if (req.sessionID) {
    addToBlacklist(req.sessionID);
  }
  req.logout(() => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

export default router; 