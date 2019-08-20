let userService = () => {
    let blueBirdPromise = require('bluebird');
    let User = require('../Models/User');
    let Pet = require('../Models/Pet');
    let mongoose = require('mongoose');
    const uploadService = require('../Services/uploadService')();
    const userOauthService = require('../ClientOAuth/addUser')();

    let getUsers = () => {
        return new blueBirdPromise((resolve, reject) => {
            let aggregation = [
                {$lookup: {from: 'pets', localField: '_id', foreignField: 'owner', as: 'pets'}},
                {
                    $project: {
                        password: 0,
                        __v: 0
                    }
                },
                {
                    $addFields: {
                        pets_count: {$size: '$pets'},
                    }
                }
            ];
            User.aggregate(aggregation).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            })
        });
    };

    let getUserProfile = (user) => {
        return new blueBirdPromise((resolve, reject) => {
            let aggregation = [
                {$match: {_id: mongoose.Types.ObjectId(user)}},
                {
                    $project: {
                        password: 0,
                        __v: 0,
                        isActive: 0,
                        referredBy: 0,
                        lastLoginDate: 0
                    }
                }
            ];
            User.aggregate(aggregation).then((result) => {
                resolve(result[0]);
            }).catch((err) => {
                reject(err);
            })
        });
    };

    let updateUserProfile = (user, body) => {
        return new blueBirdPromise((resolve, reject) => {
            if (body.profilePic) {
                uploadService.uploadFile(body.profilePic).then((link) => {
                    body.profilePic = link;
                    User.findOneAndUpdate({_id: user}, {$set: body}, {new: true}, function (err, result) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    })
                }).catch((err) => {
                    reject(err);
                })
            } else {
                User.findOneAndUpdate({_id: user}, {$set: body}, {new: true}, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            }
        });
    };

    let updateUser = (id, body) => {
        return new blueBirdPromise((resolve, reject) => {
            User.findOneAndUpdate({_id: id}, {$set: body}, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    let deleteUser = (id) => {
        return new blueBirdPromise((resolve, reject) => {
            Pet.findOne({owner: id}, function (err, pet) {
                if (err) {
                    reject(err);
                } else {
                    if (pet) {
                        reject('cannotDeleteUser');
                    } else {
                        User.findOneAndRemove({_id: id}, function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                userOauthService.deleteUser(id).then(() => {
                                    resolve();
                                }).catch((err) => {
                                    reject(err);
                                })
                            }
                        })
                    }
                }
            });
        });
    };

    return {
        getUsers: getUsers,
        getUserProfile: getUserProfile,
        updateUserProfile: updateUserProfile,
        updateUser: updateUser,
        deleteUser: deleteUser
    }
};
module.exports = userService;
