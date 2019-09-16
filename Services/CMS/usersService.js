let usersService = () => {
    let bluebirdPromise = require('bluebird'),
        Users = require('../../Models/CMS/user'),
        paginateService = require('../paginateService')(Users),
        emailService = require('../emailService')(),
        oAuthProvider = require('../../CMSUsersOauth/express')(),
        randomString = require('randomstring'),
        SHA256 = require("crypto-js/sha256");
    // gmailService = require('../../GmailApi/gmailService')();

    let filterGetUsers = (data) => {
        return new bluebirdPromise((resolve) => {
            for (let item of data) {
                item.active ? item.activeText = 'Active' : item.activeText = 'Inactive';
            }
            resolve(data);
        });
    };

    let getUsers = (query, page, limit, sort) => {
        return new bluebirdPromise((resolve, reject) => {

            let options = {
                select: {password: 0}
            };
            paginateService.getCMSData(query, page, limit, sort, options).then((result) => {
                filterGetUsers(result.data).then((filteredResult) => {
                    result.data = filteredResult;
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    };

    let addUser = (data) => {
        return new bluebirdPromise((resolve, reject) => {
            const generatedPass = randomString.generate(10);
            data.password = SHA256(generatedPass).toString();
            paginateService.addData(data).then((result) => {
                oAuthProvider.addUserOAuthClient(result._id, result.email).then(() => {
                    const subject = 'Animal House - Login Credentials';
                    const text = '<div>Welcome to Animal House,</div><br/>' +
                        '<div>Start using the panel by following this link ( animalhousecms.com ).</div><br/>' +
                        '<div>Your login username is : ' + result.email + ' and your password is: ' + generatedPass + '</div><br/>' +
                        '<div>Cheers.</div>';

                    emailService.sendEmail(result.email, subject, text);
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    };

    let updateUser = (data) => {
        return new bluebirdPromise((resolve, reject) => {
            const id = data._id;
            delete data._id;

            Users.findByIdAndUpdate(id, data, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    let deactivateUsers = (data) => {
        return new bluebirdPromise((resolve, reject) => {
            let query = {
                _id: {$in: data.users},
                default: {$ne: true}
            };
            Users.update(query, {$set: {active: false}}, {multi: true}, (err) => {
                if (err) {
                    reject(err);
                } else {
                    getCustomUsers(data.users).then((customUsers) => {
                        if (customUsers.length > 0) {
                            oAuthProvider.removeUsersOAuthTokens(customUsers);
                        }

                        resolve();
                    }).catch(() => {
                        reject(err);
                    });
                }
            });
        });
    };

    let getCustomUsers = (users) => {
        return new bluebirdPromise((resolve, reject) => {
            let query = {
                _id: {$in: users},
                default: {$ne: true}
            };
            Users.distinct('_id', query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };

    let activateUsers = (data) => {
        return new bluebirdPromise((resolve, reject) => {
            let query = {
                _id: {$in: data.users},
                default: {$ne: true}
            };
            Users.update(query, {$set: {active: true}}, {multi: true}, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    return {
        getUsers: getUsers,
        addUser: addUser,
        updateUser: updateUser,
        deactivateUsers: deactivateUsers,
        activateUsers: activateUsers
    }
};
module.exports = usersService;
