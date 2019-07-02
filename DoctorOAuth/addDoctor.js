let addUser = () => {
    let doctorModel = require('../Models/Doctor'),
        clientModel = require('./mongodb/OAuthClient'),
        randomString = require('randomstring'),
        bluebirdPromise = require('bluebird');

    let createDoctorAndAccessCode = (body) => {
        return new bluebirdPromise((resolve, reject) => {
            let user = new doctorModel(body);
            user.registrationDate = new Date();
            user.activationCode = randomString.generate(6);
            user.save((err, newRecord) => {
                err ? reject(err) : resolve(newRecord);

            });
        });
    };

    let validateDoctorAccessCode = (accessCode) => {
        return new bluebirdPromise((resolve, reject) => {
            doctorModel.findOne({activationCode: accessCode}).then((user) => {
                resolve(user._id);
            }).catch((err) => {
                reject(err);
            })
        });
    };

    let updateDoctor = (id, query) => {
        return new bluebirdPromise((resolve, reject) => {
            doctorModel.findOneAndUpdate({_id: id}, query).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            })
        });
    };

    let addUsernameAndPassword = (accessCode, username, password) => {
        return new bluebirdPromise((resolve, reject) => {
            validateDoctorAccessCode(accessCode).then((userID) => {
                doctorModel.findOne({username: username}).then((user) => {
                    if (user) {
                        reject('exists');
                    } else {
                        updateDoctor(userID, {$set: {username: username, password: password}}).then(() => {
                            createOAuthClient(userID, username).then(() => {
                                updateDoctor(userID, {$unset: {activationCode: ''}}).then(() => {
                                    resolve();
                                }).catch((err) => {
                                    reject(err);
                                })
                            }).catch((err) => {
                                reject(err);
                            });
                        }).catch((err) => {
                            reject(err);
                        })
                    }
                }).catch((err) => {
                    reject(err);
                })
            }).catch((err) => {
                reject('invalidAccessCode');
            })
        });
    };

    let createOAuthClient = (userId, username) => {
        return new bluebirdPromise((resolve, reject) => {
            const oauthClient = {
                client_id: username,
                client_secret: randomString.generate(10),
                User: userId
            };
            let client = new clientModel(oauthClient);
            client.save((err) => {
                err ? reject(err) : resolve(true);

            });
        });
    };

    return {
        createDoctorAndAccessCode: createDoctorAndAccessCode,
        validateDoctorAccessCode: validateDoctorAccessCode,
        addUsernameAndPassword: addUsernameAndPassword
    }
};
module.exports = addUser;
