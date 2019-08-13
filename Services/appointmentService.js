let Service = () => {
    let blueBirdPromise = require('bluebird');
    let moment = require('moment');
    let mongoose = require('mongoose');
    let Appointment = require('../Models/Appointment');
    let Doctor = require('../Models/Doctor');
    let DoctorsSchedule = require('../Models/DoctorsSchedule');
    let Pet = require('../Models/Pet');
    let AppointmentType = require('../Models/AppointmentType');

    let addAppointment = (userID, body) => {
        return new blueBirdPromise((resolve, reject) => {
            AppointmentType.findById(body.appointmentType).then((appointmentType) => {
                if (appointmentType) {
                    Doctor.findById(body.doctor).then((doctor) => {
                        if (doctor) {
                            Pet.findOne({owner: userID, _id: body.pet}).then((pet) => {
                                if (pet) {
                                    const startDate = moment(body.startDate);
                                    const endDate = moment(body.startDate).add(appointmentType.procedureTime, 'minutes').format();
                                    const day = startDate.day();
                                    DoctorsSchedule.findOne({Doctor: body.doctor, day: day}).then((schedule) => {
                                        let startDateCompare = Date.parse('20 Aug 2000 ' + moment(startDate).format('hh:mm a'));
                                        let endDateCompare = Date.parse('20 Aug 2000 ' + moment(endDate).format('hh:mm a'));
                                        let toDateCompare = Date.parse('20 Aug 2000 ' + moment(schedule.to_time).format('hh:mm a'));
                                        let fromDateCompare = Date.parse('20 Aug 2000 ' + moment(schedule.from_time).format('hh:mm a'));
                                        if (schedule && (startDateCompare > fromDateCompare || startDateCompare === fromDateCompare)
                                            && (startDateCompare < toDateCompare)
                                            && (endDateCompare > fromDateCompare)
                                            && (endDateCompare < toDateCompare || endDateCompare === toDateCompare)) {
                                            let findQuery = {
                                                $and: [
                                                    {
                                                        $or: [
                                                            {startDate: startDate},
                                                            {
                                                                $and: [
                                                                    {startDate: {$lt: startDate}},
                                                                    {endDate: {$gt: startDate}}
                                                                ]
                                                            },
                                                            {
                                                                $and: [
                                                                    {startDate: {$lt: endDate}},
                                                                    {endDate: {$gt: endDate}}
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {doctor: mongoose.Types.ObjectId(body.doctor)}
                                                ]
                                            };
                                            Appointment.findOne(findQuery).then((appointments) => {
                                                if (appointments) {
                                                    reject('appointment_exists');
                                                } else {
                                                    let record = new Appointment({
                                                        doctor: body.doctor,
                                                        pet: body.pet,
                                                        appointmentType: body.appointmentType,
                                                        user: userID,
                                                        startDate: startDate,
                                                        endDate: endDate
                                                    });
                                                    record.save(function (err) {
                                                        if (err) {
                                                            reject(err);
                                                        } else {
                                                            resolve();
                                                        }
                                                    })
                                                }
                                            }).catch((err) => {
                                                reject(err);
                                            });
                                        }
                                        else {
                                            reject('doctor_not_available');
                                        }
                                    }).catch((err) => {
                                        reject(err);
                                    });
                                } else {
                                    reject('not_found');
                                }
                            }).catch((err) => {
                                reject(err);
                            });
                        } else {
                            reject('not_found');
                        }
                    }).catch((err) => {
                        reject(err);
                    });
                } else {
                    reject('not_found');
                }
            }).catch((err) => {
                reject(err);
            });
        });
    };

    return {
        addAppointment: addAppointment
    }
};
module.exports = Service;
