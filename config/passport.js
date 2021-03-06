
var mongoose = require('mongoose')
  , LocalStrategy = require('passport-local').Strategy
  , User = mongoose.model('User');


module.exports = function (passport, config) {

  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, function (err, user) {
      done(err, user)
    })
  })

  // use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      console.log('in passport local strategy')
      User.findOne({ email: email, active: true }, function (err, user) {
        if (err) {
          console.log('in err');
          return done(err) }
        if (!user) {
          console.log('in not user');
          return done(null, false, { message: 'Unknown user' })
        }
        if (!user.authenticate(password)) {
          console.log('in bad pass');
          return done(null, false, { message: 'Invalid password' })
        }
        return done(null, user)
      })
    }
  ))


}
