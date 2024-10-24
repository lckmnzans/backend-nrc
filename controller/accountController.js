const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validateRegisterInput = require('../validation/register');
const { tokenAge, jwtSecret } = require('../config/jwt');
const { hostname, port } = require('../config/keys');
const jwt = require('jwt-simple');
const passport = require('passport');
const transporter = require('../config/nodemailer');

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
    });
});

const passwordValidation = require('../validation/password');
router.patch('/account', passport.authenticate('jwt', { session: false}), checkUserRole(['admin','superadmin']), async (req,res) => {
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
        });
    })
    .catch(err => { 
        return res.status(500).json({ message: err.message }) 
    });
});

router.post('/request-reset', async (req,res) => {
    const { username, email } = req.body;
    if (username == null || email == null) return res.status(400).json({ message: 'Username and/or email are empty' });

    User.findOne({ username, email })
    .then(async (user) => {
        if (!user) {
            return res.status(404).json({ message: 'User not exist' });
        }
        user.updateOne({ resetStatus: 'pending'}).then(() => {
            return res.status(200).json({ message: 'Reset request received, waiting for approval. Check your email regularly.'})
        })
    })
    .catch((err) => {
        return res.status(500).json({ message: err.message });
    });
});

router.post('/approve-reset/:userId', passport.authenticate('jwt', { session: false }), checkUserRole(['superadmin']), async (req,res) => {
    const { userId } = req.params;
    const { username, email } = req.body;

    User.findById(userId)
    .then(async user => {
        if (!user) {
            return res.status(404).json({ message: 'User not found'});
        }
        if (username == user.username && email == user.email) {
            const otp = crypto.randomInt(100000, 999999).toString();
            await user.updateOne({ 
                resetStatus: 'approved', 
                otp: otp, 
                otpExpiry: new Date(Date.now() + 10 * 60 * 1000) 
            });
            const token = jwt.encode({ id: userId, expire: Date.now() + tokenAge }, 'RESET-PASSWORD KEY');
            const link = `http://${hostname}:${port}/api/v1/reset-pass?token=${token}`;
            //still bugged because username and password email isn't accepted
            await transporter.sendMail({
                to: user.email,
                subjet: 'Reset password link',
                text: 'Access this link to reset your password',
                html:  `<p>Access this link to reset your password: <a href="${link}">${link}</a></p><br><p>Your OTP Code is: ${otp}`
            })
            return res.json({ message: 'Reset password request approved, email sent' });
        }
        return res.status(400).json({ message: 'Username and/or email do not match' });
    })
    .catch(err => {
        return res.status(500).json({ message: err.message });
    });
});

router.post('/reset-pass', async (req,res) => {
    const { token } = req.query;
    const { otp, newPassword } = req.body;
    const userId = jwt.decode(token, 'RESET-PASSWORD KEY').id;
    User.findById(userId)
    .then(async user => {
        if (!user) {
            return res.status(404).json({ message: 'User not found'});
        }
        const checkNewPassword = passwordValidation(newPassword);
        if (user.otp == otp) {
            if (checkNewPassword.error) {
                return res.status(400).json({ message: checkNewPassword.message })
            } else {
                user.setPassword(newPassword)
                .then(() => { return res.json({ message:  'Password reset successfully' }) })
                .catch(err => { return res.status(500).json({ message: err.message }) });
            }
        } else {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
    })
    .catch(err => { return res.status(500).json({ message: err.message }) });
});

module.exports = router;