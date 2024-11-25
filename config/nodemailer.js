const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'johathan.maggio@ethereal.email',
        pass: 'UTQRbJgegE1B7GhDqE'
    }
});

module.exports = transporter;