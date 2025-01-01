require('dotenv').config();
const nodemailer = require('nodemailer');
const user = {
    username: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASS || ''
}

const transporter = nodemailer.createTransport({
    pool: true,
    host: 'mail.nusarayacipta.com',
    port: 465,
    secure: true,
    auth: {
        user: user.username,
        pass: user.password
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('\x1b[36m%s\x1b[0m','SMTP Server is ready to take our messages');
    }
})

module.exports = { transporter, userMail: user };