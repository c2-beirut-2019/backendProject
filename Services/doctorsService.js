let doctorsService = () => {
    let blueBirdPromise = require('bluebird');
    let Doctor = require('../Models/Doctor');

    let getDoctorsList = () => {
        return new blueBirdPromise((resolve, reject) => {
            let aggregation = [
                {
                    $project: {
                        firstName: 1,
                        lastName: 1,
                        speciality: 1,
                        diplomas: 1
                    }
                }
            ];
            Doctor.aggregate(aggregation).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            })
        });
    };

    let getDoctors = () => {
        return new blueBirdPromise((resolve, reject) => {
            let aggregation = [
                {
                    $project: {
                        password: 0,
                        __v: 0
                    }
                }
            ];
            Doctor.aggregate(aggregation).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            })
        });
    };

    return {
        getDoctorsList: getDoctorsList,
        getDoctors: getDoctors
    }
};
module.exports = doctorsService;