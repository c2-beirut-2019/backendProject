let userService = () => {
    let blueBirdPromise = require('bluebird');
    let User = require('../Models/User');
    let mongoose = require('mongoose');

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
            User.findOneAndUpdate({_id: user}, {$set: body}, {new: true}, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    };

    return {
        getUsers: getUsers,
        getUserProfile: getUserProfile,
        updateUserProfile: updateUserProfile
    }
};
module.exports = userService;
