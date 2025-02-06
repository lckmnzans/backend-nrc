var LocalStrategy = require('passport-local');
const User = require('../model/User');

var strategy = new LocalStrategy(function verify(username, password, cb) {
  User.findOne({ username: username }, function(err, user) {
    if (err) { return cb(err); }
    if (!user) { return cb(null, false, { success: false, message: 'Incorrect username or password.' }); }
    
    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
        return cb(null, false, { success: false, message: 'Incorrect username or password.' });
      }
      return cb(null, user);
    });
  });
});

module.exports = strategy;