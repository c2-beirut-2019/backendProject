let userService = () => {
    let blueBirdPromise = require('bluebird');
    let User = require('../Models/User');

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

    return {
        getUsers: getUsers
    }
};
module.exports = userService;
