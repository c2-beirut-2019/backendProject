let emailService = () => {
    let bluebirdPromise = require('bluebird');
    let nodemailer = require('nodemailer');
    let config = require('../config');

    let sendEmail = (toEmail, subject, body) => {
        return new bluebirdPromise((resolve, reject) => {
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                service: `gmail`,
                auth: {
                    user: config.mail.email,
                    pass: config.mail.password
                }
            });
            let mailOptions = {
                from: config.mail.email,
                to: toEmail,
                subject: subject,
            };
            mailOptions.html = body;
            transporter.sendMail(mailOptions).then((result) => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    };

    return {
        sendEmail: sendEmail
    };
};
module.exports = emailService;