const mongoose = require('mongoose');
const url = require('../config/keys').mongoUri;
const User = require('../model/User');

class MongoUtils {
    static async checkAndInsertUser() {
        try {
            const existingUser = await User.findOne({ username: 'superuser', role: 'superadmin' });
            if (existingUser) {
                console.log('Superuser already exists. Skipping data insertion.');
            } else {
                console.log('Superuser does not exist. Inserting...');
                const rootAccount = new User({
                    username: 'superuser',
                    email: 'superuser@mail.com',
                    role: 'superadmin'
                })
                User.register(rootAccount, "password123", (err,msg) => {
                    if (err) {
                        console.log('Error registering a superuser: ', err);
                    } else {
                        console.log('Superuser inserted successfully.');
                    }
                });
            };
        } catch (error) {
            console.error('Error at checkAndInsertUser(): ', error);
        };
    }
}

module.exports = MongoUtils;