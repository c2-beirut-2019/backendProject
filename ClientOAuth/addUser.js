let addUser = () => {
    let userModel = require('../Models/User'),
        clientModel = require('./mongodb/OAuthClient'),
        accessTokenModel = require('./mongodb/OAuthAccessToken'),
        refreshTokenModel = require('./mongodb/OAuthRefreshToken'),
        randomString = require('randomstring'),
        bluebirdPromise = require('bluebird');

    let createClientAndAccessCode = (body) => {
        return new bluebirdPromise((resolve, reject) => {
            let user = new userModel(body);
            user.registrationDate = new Date();
            user.activationCode = randomString.generate(6);
            user.save((err, newRecord) => {
                err ? reject(err) : resolve(newRecord);

            });
        });
    };

    let validateClientAccessCode = (accessCode) => {
        return new bluebirdPromise((resolve, reject) => {
            userModel.findOne({activationCode: accessCode}).then((user) => {
                resolve(user._id);
            }).catch((err) => {
                reject(err);
            })
        });
    };

    let updateClient = (id, query) => {
        return new bluebirdPromise((resolve, reject) => {
            userModel.findOneAndUpdate({_id: id}, query).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            })
        });
    };

    let addUsernameAndPassword = (accessCode, username, password) => {
        return new bluebirdPromise((resolve, reject) => {
            validateClientAccessCode(accessCode).then((userID) => {
                userModel.findOne({username: username}).then((user) => {
                    if (user) {
                        reject('exists');
                    } else {
                        updateClient(userID, {$set: {username: username, password: password}}).then(() => {
                            createOAuthClient(userID, username).then(() => {
                                updateClient(userID, {$unset: {activationCode: ''}}).then(() => {
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

    let deleteUser = (id) => {
        return new bluebirdPromise((resolve, reject) => {
            clientModel.findOneAndRemove({User: id}).then(() => {
                accessTokenModel.findOneAndRemove({User: id}).then(() => {
                    refreshTokenModel.findOneAndRemove({User: id}).then(() => {
                        resolve();
                    }).catch((err) => {
                        reject(err);
                    })
                }).catch((err) => {
                    reject(err);
                })
            }).catch((err) => {
                reject(err);
            })
        });
    };

    return {
        // createUser: createUser,
        createClientAndAccessCode: createClientAndAccessCode,
        validateClientAccessCode: validateClientAccessCode,
        addUsernameAndPassword: addUsernameAndPassword,
        deleteUser: deleteUser
    }
};
module.exports = addUser;
