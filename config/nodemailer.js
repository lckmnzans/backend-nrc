const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'jeramie.weimann53@ethereal.email',
        pass: 'Egfy7vayrn1umQxH8W'
    }
});

module.exports = transporter;