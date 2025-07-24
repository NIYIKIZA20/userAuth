import { Router } from 'express';
import passport from 'passport';
import { addToBlacklist } from '../utils/sessionBlacklist';

const router = Router();

// Redirect to Google for authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth2 callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/dashboard');
  }
);

// Logout route
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