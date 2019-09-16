let passwordController = () => {
    let errorMessagesService = require('../../Services/messagesService'),
        async = require('async'),
        User = require('../../Models/CMS/user'),
        emailService = require('../../Services/emailService')(),
        UserResetPassword = require('../../Models/CMS/userResetPassword'),
        randomString = require('randomstring'),
        mongoose = require('mongoose'),
        moment = require('moment'),
        oAuthProvider = require('../../CMSUsersOauth/express')();

    let changePassword = (req, res) => {
        User.findOne({
            _id: req.user._id,
            password: req.body.oldPassword
        }, (err, user) => {
            if (err)
                res.status(500).send(errorMessagesService.serverError);
            else if (user) {
                User.findByIdAndUpdate(user._id, {$set: {password: req.body.password}}, (err) => {
                    if (err)
                        res.status(500).send(errorMessagesService.serverError);
                    else {
                        res.send(errorMessagesService.updated);
                    }
                });
            } else {
                res.status(400).send(errorMessagesService.wrongCredentials);
            }
        });
    };

    let generateForgetPassword = (req, res) => {
        async.waterfall([
            (done) => {
                let token = randomString.generate({
                    length: 50,
                    charset: 'alphabetic'
                });
                done(undefined, token);
            },
            (token, done) => {
                User.findOne({email: req.body.email}, (err, user) => {
                    if (err) {
                        return done(err, token, '');
                    } else if (!user) {
                        res.status(404).send(errorMessagesService.not_found);
                    } else {
                        const resetPasswordExpires = Date.now() + (60 * 15 * 1000);
                        let resetPasswordExpiresFormatted = moment(resetPasswordExpires).format('YYYY-MM-DD HH:mm Z');
                        let userResetPassword = {
                            user: user._id,
                            resetPasswordToken: token,
                            resetPasswordExpires: resetPasswordExpires
                        };
                        UserResetPassword.findOneAndUpdate({_id: user._id}, userResetPassword, {upsert: true}, (err, result) => {
                            if (err) {
                                return done(err, token, resetPasswordExpiresFormatted, user);
                            } else {
                                return done(null, token, resetPasswordExpiresFormatted, user);
                            }
                        });
                    }
                });
            },
            (token, date, user, done) => {
                const link = 'http://localhost:4200/#/reset/' + token;
                const subject = 'Animal House - Password Reset';
                const text = '<div>Hello ' + user.firstName + ' ' + user.lastName + '</div><br/>' +
                    '<div>Did you request to change your password? If yes, follow this link before ' + date + ' in order to reset your password: ' + link + '</div><br/>' +
                    '<div>If not, just ignore this email, your password won\'t be changed. </div><br/>' +
                    '<div>Cheers.</div>';
                emailService.sendEmail(user.email, subject, text).then(() => {
                    return done(null, 'done');
                }).catch((err) => {
                    return done(err, 'done');
                });
            }
        ], (err) => {
            if (err) {
                res.status(500).send(errorMessagesService.serverError);
            } else {
                res.send(errorMessagesService.updated);
            }
        });
    };

    let resetPassword = (req, res) => {
        UserResetPassword.findOne({resetPasswordToken: req.body.token}, (err, userResetPassword) => {
            if (err)
                res.status(500).send(errorMessagesService.serverError);
            else if (userResetPassword) {
                if (userResetPassword.resetPasswordExpires > Date.now()) {
                    User.update({_id: mongoose.Types.ObjectId(userResetPassword.user)}, {$set: {password: req.body.password}}, (err, user) => {
                        if (err)
                            res.status(500).send(errorMessagesService.serverError);
                        else {
                            UserResetPassword.remove({_id: userResetPassword._id}).exec();
                            oAuthProvider.removeUsersOAuthTokens([userResetPassword.user]);
                            res.status(200).send(errorMessagesService.updated)
                        }
                    })
                } else {
                    console.log('testtttt');
                    res.status(401).send(errorMessagesService.passwordTokenExpired)
                }
            } else {
                res.status(401).send(errorMessagesService.passwordTokenInvalid)
            }
        })
    };

    let checkToken = (req, res) => {
        UserResetPassword.findOne({resetPasswordToken: req.params.id}, (err, userResetPassword) => {
            if (err)
                res.status(500).send(errorMessagesService.serverError);
            else if (userResetPassword) {
                res.end();
            } else {
                res.status(401).send(errorMessagesService.passwordTokenInvalid)
            }
        })
    };

    return {
        changePassword: changePassword,
        generateForgetPassword: generateForgetPassword,
        resetPassword: resetPassword,
        checkToken: checkToken
    }
};
module.exports = passwordController;
