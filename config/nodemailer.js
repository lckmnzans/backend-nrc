const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'jeromy49@ethereal.email',
        pass: 'SZreHj8zg4gfRCVuKj'
    }
});

module.exports = transporter;