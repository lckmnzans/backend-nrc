const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lckmnzans@gmail',
        pass: 'jjht viyk vzll fajg'
    }
});

module.exports = transporter;