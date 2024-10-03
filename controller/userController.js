const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const validateRegisterInput = require('../validation/register');

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
                console.log('Creating a new user')
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => console.log("User created"))
                            .catch(err => console.log(err));
                        return res.json(newUser);
                    })
                })
            }
        })
})

module.exports = router;