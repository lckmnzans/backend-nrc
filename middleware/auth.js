const User = require('../model/User');
const passport = require('passport');
const passportJwt = require('passport-jwt');
const { ExtractJwt, Strategy } = passportJwt;
const { jwtSecret } = require('../config/jwt');

var params = {
    secretOrKey: jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}

module.exports = function() {
    var strategy = new Strategy(params,  function(payload, done) {
        User.findById(payload.id)
        .then(user => {
            if (!user) {
                return done(new Error('UserNotFound', null))
            } else if (payload.expire <= Date.now()) {
                return done(new Error('TokenExpired', null))
            } else {
                return done(null, user)
            }
        });
    });

    passport.use(strategy);

    return {
        initialize: function() {
            return passport.initialize()
        }
    }
}
