import { User } from '../models/user';

declare global {
  namespace Express {
    interface User extends import('../models/user').User {}
  }
}

export {};
