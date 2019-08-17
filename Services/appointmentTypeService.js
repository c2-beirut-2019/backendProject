let Service = () => {
    let blueBirdPromise = require('bluebird');
    let AppointmentType = require('../Models/AppointmentType');
    let Appointment = require('../Models/Appointment');

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

    let updateAppointmentType = (id, body) => {
        return new blueBirdPromise((resolve, reject) => {
            AppointmentType.findOneAndUpdate({_id: id}, {$set: body}, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });
    };

    let deleteAppointmentType = (id) => {
        return new blueBirdPromise((resolve, reject) => {
            Appointment.findOne({appointmentType: id}, function (err, type) {
                if (err) {
                    reject(err);
                } else {
                    if (type) {
                        reject('cannotDeleteType');
                    } else {
                        AppointmentType.findOneAndRemove({_id: id}, function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        })
                    }
                }
            });
        });
    };

    return {
        getAppointmentTypes: getAppointmentTypes,
        addAppointmentType: addAppointmentType,
        updateAppointmentType: updateAppointmentType,
        deleteAppointmentType: deleteAppointmentType
    }
};
module.exports = Service;
