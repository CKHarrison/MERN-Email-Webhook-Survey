const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');
// putting user info into token which will go into cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// taking user id from token into cookie and turning into model instance
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

// implementing passport strategy with google
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    // once user information comes back from google we can save it
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        // already have an existing user, shortcut return
        return done(null, existingUser);
      }
      // if we don't have an existing user
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  )
);
