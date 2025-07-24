import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { findByGoogleId, createUser, findById } from '../database/userRepository';
import { User } from '../models/user';

passport.serializeUser((user:any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await findById(id);
    done(null, user || null);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK_URL!,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await findByGoogleId(profile.id);
    if (!user) {
      user = await createUser({
        name: profile.displayName,
        email: profile.emails?.[0].value || '',
        picture: profile.photos?.[0].value || '',
        googleId: profile.id,
        createdAt: new Date(),
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, undefined);
  }
}));

export default passport; 