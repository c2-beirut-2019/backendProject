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
                                        if (schedule) {
                                            let startDateCompare = Date.parse('20 Aug 2000 ' + moment(startDate).format('hh:mm a'));
                                            let endDateCompare = Date.parse('20 Aug 2000 ' + moment(endDate).format('hh:mm a'));
                                            let toDateCompare = Date.parse('20 Aug 2000 ' + moment(schedule.to_time).format('hh:mm a'));
                                            let fromDateCompare = Date.parse('20 Aug 2000 ' + moment(schedule.from_time).format('hh:mm a'));
                                            if ((startDateCompare > fromDateCompare || startDateCompare === fromDateCompare)
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
                                        } else {
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

    let getAppointments = (userID, doctorID) => {
        return new blueBirdPromise((resolve, reject) => {
            let match = {};
            if (doctorID) {
                match = {doctor: mongoose.Types.ObjectId(doctorID)}
            }
            let aggregation = [
                {$match: match},
                {
                    $project: {
                        user: 0,
                        pet: 0,
                        doctor: 0,
                        appointmentType: 0
                    }
                },
                {$sort: {startDate: 1}}
            ];
            Appointment.aggregate(aggregation).then((results) => {
                resolve(results);
            }).catch((err) => {
                reject(err);
            })
        });
    };

    let getAppointmentsByType = (userID, doctorID, petID, appointmentType, search, sortBy, sortOrder, isCMS = false) => {
        return new blueBirdPromise((resolve, reject) => {
            let sort = {startDate: -1};
            if (sortBy) {
                sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
            }
            let match = {$and: []};
            if (isCMS) {
                match = {};
            }
            if (userID) {
                match.$and.push({user: mongoose.Types.ObjectId(userID)});
            }
            if (doctorID) {
                match.$and.push({doctor: mongoose.Types.ObjectId(doctorID)});
            }
            if (petID) {
                match.$and.push({pet: mongoose.Types.ObjectId(petID)});
            }
            if (appointmentType) {
                match.$and.push({appointmentType: mongoose.Types.ObjectId(appointmentType)});
            }
            let aggregation = [
                {$match: match},
                {$lookup: {from: 'pets', localField: 'pet', foreignField: '_id', as: 'pet'}},
                {$unwind: {path: '$pet', preserveNullAndEmptyArrays: true}},
                {$lookup: {from: 'doctors', localField: 'doctor', foreignField: '_id', as: 'doctor'}},
                {$unwind: {path: '$doctor', preserveNullAndEmptyArrays: true}},
                {$lookup: {from: 'users', localField: 'user', foreignField: '_id', as: 'user'}},
                {$unwind: {path: '$user', preserveNullAndEmptyArrays: true}},
                {
                    $lookup: {
                        from: 'appointment_types',
                        localField: 'appointmentType',
                        foreignField: '_id',
                        as: 'appointmentType'
                    }
                },
                {$unwind: {path: '$appointmentType', preserveNullAndEmptyArrays: true}},
                {
                    $project: {
                        startDate: 1,
                        endDate: 1,
                        doctor_id: '$doctor._id',
                        doctor_firstName: '$doctor.firstName',
                        doctor_lastName: '$doctor.lastName',
                        user_id: '$user._id',
                        user_firstName: '$user.firstName',
                        user_lastName: '$user.lastName',
                        doctor_speciality: '$doctor.speciality',
                        pet_id: '$pet._id',
                        pet_name: '$pet.name',
                        pet_image: '$pet.image',
                        appointmentType_id: '$appointmentType._id',
                        appointmentType_name: '$appointmentType.name',
                    }
                },
                {$sort: sort}
            ];
            let predefinedSearchFields = ['doctor_firstName', 'doctor_lastName', 'user_firstName', 'user_lastName', 'doctor_speciality', 'pet_name', 'appointmentType_name'];
            let searchQuery = [];
            predefinedSearchFields.forEach((key) => {
                if (search && search !== '') {
                    searchQuery.push({[key]: {$regex: search, $options: "i"}});
                }
            });
            if (searchQuery.length > 0) {
                aggregation.push({$match: {$or: searchQuery}});
            }
            Appointment.aggregate(aggregation).then((results) => {
                resolve(results);
            }).catch((err) => {
                reject(err);
            })
        });
    };

    return {
        addAppointment: addAppointment,
        getAppointments: getAppointments,
        getAppointmentsByType: getAppointmentsByType
    }
};
module.exports = Service;
