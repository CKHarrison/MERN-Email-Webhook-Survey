const passport = require('passport');

module.exports = app => {
  // telling google what information we want
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  // giving the code from google back to google to verify authorization of user's info and turn into profile
  app.get('/auth/google/callback', passport.authenticate('google'));

  // logging out users
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.send(req.user);
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
