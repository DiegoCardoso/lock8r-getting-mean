const passport = require('passport');
//Read it like 'Strategy AS LocalStrategy'
const { Strategy: LocalStrategy } = require('passport-local');
const mongoose = require('mongoose');

const User = mongoose.model('User');

passport.use(new LocalStrategy({
  usernameField: 'email',
  session: false,
}, (username, password, done) => {
    console.log('ENTROU AQUI, RAPAIZ!');
    User.findOne({ email: username }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, {
          message: 'Incorrect username.',
        });
      }

      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect password.',
        });
      }

      return done(null, user);
    });
  }
));
