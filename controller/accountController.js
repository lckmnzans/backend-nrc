const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const validateRegisterInput = require('../validation/register');
const { tokenAge, jwtSecret } = require('../config/jwt');
const jwt = require('jwt-simple');
const passport = require('passport');

const checkUserRole = require('../validation/credential');

router.post('/register', passport.authenticate('jwt', { session: false}), checkUserRole(['superadmin']), (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                return res.status(400).json({'email':'Alamat email sudah digunakan'});
            } else {
                User.register(
                    new User({
                        username: req.body.username,
                        email: req.body.email,
                        role: req.body.role
                    }), req.body.password, (err, msg) => {
                        if (err) {
                            return res.status(400).send(err);
                        } else {
                            return res.send({ message: "Successful" });
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
                id: user.id,
                role: user.role,
                expire: Date.now() + tokenAge
            }

            var token = jwt.encode(payload, jwtSecret);

            return res.json({ token: token });
        }
    })
});

router.get('/profile', passport.authenticate('jwt', { session: false}), checkUserRole(['admin','superadmin']), (req, res) => {
    return res.json({
        message: 'Welcome, you made it to the secured profile',
        user: req.user,
        token: req.query.secret_token
    })
})

router.get('/account', passport.authenticate('jwt', { session: false}), checkUserRole(['superadmin']), (req, res) => {
    User.find({})
    .then((accounts) => {
        if (!accounts) {
            return res.status(404).json({ message: "No accounts found" })
        } else {
            return res.json(accounts);
        }
    })
    .catch((err) => {
        return res.status(500).json({ message: err.message });
    });
});

router.get('/account/:username', passport.authenticate('jwt', { session: false}), checkUserRole(['superadmin']), (req, res) => {
    User.findOne({ username: req.params.username })
    .then((user) => {
        if (!user) {
            return res.status(404).json({ message:'Username not exist' });
        } else {
            return res.json(user);
        }
    })
});

const passwordValidation = require('../validation/password');
router.patch('/account', passport.authenticate('jwt', { session: false}), async (req,res) => {
    const { username, oldPassword, newPassword } =  req.body;

    const checkNewPassword = passwordValidation(newPassword);
    if (checkNewPassword.error) {
        return res.status(400).json({ message: checkNewPassword.message })
    }

    User.findByUsername(username)
    .then(user => { 
        if (!user) {
            return res.status(402).json({ message: 'User not exist' });
        }
        user.changePassword(oldPassword, newPassword)
        .then(() => {
            return res.json({ message: 'Password changed successfully' });
        })
        .catch((err) => {
            return res.status(500).json({ message: err.message });
        })
    })
    .catch(err => { 
        return res.status(500).json({ message: err.message }) 
    });
})

router.post('/forgot-password')

module.exports = router;