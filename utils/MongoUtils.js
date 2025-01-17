const mongoose = require('mongoose');
const url = require('../config/keys').mongoUri;
const User = require('../model/User');

class MongoUtils {
    static async checkAndInsertUser() {
        try {
            await mongoose.connect(url+"/test");
    
            const collections = await mongoose.connection.db.listCollections({ name: 'users' }).toArray();
            if (collections.length === 0) {
                console.log('Collection does not exist. Skipping data insertion.');
                return;
            }
    
            const existingUser = await User.findOne({ username: 'superuser', role: 'superadmin' });
            if (existingUser) {
                console.log('Superuser already exists. Skipping data insertion.');
                return
            }
    
            const newUser = new User({
                username: 'superuser',
                email: 'superuser@mail.com',
                role: 'superadmin'
            })
            User.register(newUser, "password123", (err,msg) => {
                if (err) {
                    console.log('Error: ', err);
                } else {
                    console.log('Superuser inserted successfully.');
                }
            });
        } catch (error) {
            console.error('Error: ', error);
        } finally {
            mongoose.connection.close();
        }
    }
}

module.exports = MongoUtils;