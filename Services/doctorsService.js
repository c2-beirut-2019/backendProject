let doctorsService = () => {
    let blueBirdPromise = require('bluebird');
    let Doctor = require('../Models/Doctor');
    let DoctorSchedule = require('../Models/DoctorsSchedule');
    let moment = require('moment');
    let mongoose = require('mongoose');

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

    let addDoctorsSchedule = (body, doctor) => {
        return new blueBirdPromise((resolve, reject) => {
            DoctorSchedule.findOne({Doctor: doctor, day: body.day}, function (err, schedule) {
                if (err) {
                    reject(err);
                } else if (schedule) {
                    reject('scheduleAlreadyExists');
                } else {
                    let day_name = '';
                    switch (body.day) {
                        case 0:
                            day_name = 'Sunday';
                            break;
                        case 1:
                            day_name = 'Monday';
                            break;
                        case 2:
                            day_name = 'Tuesday';
                            break;
                        case 3:
                            day_name = 'Wednesday';
                            break;
                        case 4:
                            day_name = 'Thursday';
                            break;
                        case 5:
                            day_name = 'Friday';
                            break;
                        case 6:
                            day_name = 'Saturday';
                            break;
                    }
                    let fromTime = moment(body.from_time, ["h:mm A"]).format("HH:mm:ss").split(':');
                    let fromTimeDate = moment().set({
                        hour: parseInt(fromTime[0]),
                        minute: parseInt(fromTime[1]),
                        second: parseInt(fromTime[2])
                    }).toDate();
                    let toTime = moment(body.to_time, ["h:mm A"]).format("HH:mm:ss").split(':');
                    let toTimeDate = moment().set({
                        hour: parseInt(toTime[0]),
                        minute: parseInt(toTime[1]),
                        second: parseInt(toTime[2])
                    }).toDate();
                    let newSchedule = {
                        day: body.day,
                        Doctor: mongoose.Types.ObjectId(doctor),
                        day_name: day_name,
                        from_time: fromTimeDate,
                        to_time: toTimeDate
                    };
                    let record = new DoctorSchedule(newSchedule);
                    record.save(function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    })
                }
            });
        });
    };

    let getDoctorsSchedule = (doctor) => {
        return new blueBirdPromise((resolve, reject) => {
            let aggregation = [
                {
                    $match: {Doctor: mongoose.Types.ObjectId(doctor)}
                },
                {
                    $project: {
                        day_name: 1,
                        day: 1,
                        from_time: 1,
                        to_time: 1
                    }
                },
                {$sort: {day: 1}}
            ];
            DoctorSchedule.aggregate(aggregation, function (err, schedule) {
                if (err) {
                    reject(err);
                } else {
                    for (let sch of schedule) {
                        delete sch.day;
                        let from_time_formated = moment(sch.from_time).format('hh:mm a');
                        let to_time_formated = moment(sch.to_time).format('hh:mm a');
                        sch.from_time_formated = from_time_formated;
                        sch.to_time_formated = to_time_formated;
                    }
                    resolve(schedule);
                }
            });
        });
    };

    return {
        getDoctorsList: getDoctorsList,
        getDoctors: getDoctors,
        addDoctorsSchedule: addDoctorsSchedule,
        getDoctorsSchedule: getDoctorsSchedule
    }
};
module.exports = doctorsService;
