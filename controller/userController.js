const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const validateRegisterInput = require('../validation/register');
const { tokenAge, jwtSecret } = require('../config/jwt');
const jwt = require('jwt-simple');
const passport = require('passport');

router.post('/register', (req,res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        console.log("Does the data valid ?", isValid);
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                return res.status(400).json({'email':'Alamat email sudah digunakan'});
            } else {
                // const newUser = new User({
                //     username: req.body.username,
                //     email: req.body.email,
                //     password: req.body.password
                // });
                // bcrypt.genSalt(10, (err, salt) => {
                //     bcrypt.hash(newUser.password, salt, (err, hash) => {
                //         if (err) throw err;
                //         newUser.password = hash;
                //         newUser.save()
                //             .then(user => console.log("User created"))
                //             .catch(err => console.log(err));
                //         return res.json(newUser);
                //     })
                // })
                User.register(
                    new User({
                        username: req.body.username,
                        email: req.body.email
                    }), req.body.password, (err, msg) => {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send({ message: "Successful" });
                        }
                    }
                );
            }
        });
});

router.post('/login', passport.authenticate('local'), (req,res) => {
    User.findOne({ username: req.body.username })
    .then(user => {
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        } else {
            var payload = {
                id: user.username,
                expire: Date.now() + tokenAge
            }

            var token = jwt.encode(payload, jwtSecret);

            res.json({ token: token });
        }
    })
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        message: 'Welcome, you made it to the secured profile',
        user: req.user,
        token: req.query.secret_token
    })
})

module.exports = router;