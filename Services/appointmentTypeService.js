let Service = () => {
    let blueBirdPromise = require('bluebird');
    let AppointmentType = require('../Models/AppointmentType');

    let getAppointmentTypes = () => {
        return new blueBirdPromise((resolve, reject) => {
            AppointmentType.find({}, function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        })
    };

    let addAppointmentType = (body) => {
        return new blueBirdPromise((resolve, reject) => {
            let record = new AppointmentType(body);
            record.save(function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });
    };

    return {
        getAppointmentTypes: getAppointmentTypes,
        addAppointmentType: addAppointmentType
    }
};
module.exports = Service;
