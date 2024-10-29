const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'patrick44@ethereal.email',
        pass: 'TPFq81bbS5e5DDHFbN'
    }
});

module.exports = transporter;