import { Request, Response, NextFunction } from 'express';
import { isBlacklisted } from '../utils/sessionBlacklist';

export function checkSessionBlacklist(req: Request, res: Response, next: NextFunction) {
  if (req.sessionID && isBlacklisted(req.sessionID)) {
    req.session.destroy(() => {});
    return res.status(401).json({ success: false, message: 'Session is blacklisted. Please log in again.' });
  }
  next();
} 