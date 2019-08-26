let Controller = () => {
    let messagesService = require('../Services/messagesService');
    let doctorsService = require('../Services/doctorsService')();
    let doctorOauth = require('../DoctorOAuth/addDoctor')();

    let addDoctor = (req, res) => {
        doctorOauth.createDoctorAndAccessCode(req.body).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let validateAccessCode = (req, res) => {
        doctorOauth.validateDoctorAccessCode(req.body.accessCode).then((result) => {
            res.status(200).send();
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let addUsernameAndPassword = (req, res) => {
        doctorOauth.addUsernameAndPassword(req.body.accessCode, req.body.username, req.body.password).then(() => {
            res.status(200).send();
        }).catch((err) => {
            if (err === 'invalidAccessCode') {
                res.status(460).send(messagesService.invalidAccessCode);
            } else if (err === 'exists') {
                res.status(500).send(messagesService.usernameExists);
            } else {
                res.status(500).send(messagesService.serverError);
            }
        });
    };

    let getDoctorsList = (req, res) => {
        doctorsService.getDoctorsList().then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let getDoctors = (req, res) => {
        doctorsService.getDoctors().then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let addDoctorsSchedule = (req, res) => {
        doctorsService.addDoctorsSchedule(req.body, req.query.id).then(() => {
            res.status(200).send();
        }).catch((err) => {
            if (err === 'scheduleAlreadyExists') {
                res.status(460).send(messagesService.scheduleAlreadyExists);
            } else {
                res.status(500).send(messagesService.serverError);
            }
        });
    };

    let getDoctorsSchedule = (req, res) => {
        doctorsService.getDoctorsSchedule(req.query.id).then((results) => {
            res.status(200).send(results);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let getDoctorProfile = (req, res) => {
        doctorsService.getDoctorProfile(req.doctor._id).then((results) => {
            res.status(200).send(results);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let updateDoctorProfile = (req, res) => {
        doctorsService.updateDoctorProfile(req.doctor._id, req.body).then((results) => {
            res.status(200).send(results);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let updateDoctor = (req, res) => {
        doctorsService.updateDoctor(req.params.id, req.body).then(() => {
            res.status(200).send();
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let deleteDoctor = (req, res) => {
        doctorsService.deleteDoctor(req.params.id).then(() => {
            res.status(200).send();
        }).catch((err) => {
            if (err === 'cannotDeleteDoctor') {
                res.status(460).send(messagesService.cannotDeleteDoctor);
            } else {
                res.status(500).send(messagesService.serverError);
            }
        });
    };

    let updateDoctorSchedule = (req, res) => {
        doctorsService.updateDoctorsSchedule(req.params.id, req.body, req.query.id).then(() => {
            res.status(200).send();
        }).catch((err) => {
            if (err === 'scheduleAlreadyExists') {
                res.status(460).send(messagesService.scheduleAlreadyExists);
            } else {
                res.status(500).send(messagesService.serverError);
            }
        });
    };

    let deleteDoctorSchedule = (req, res) => {
        doctorsService.deleteDoctorSchedule(req.params.id).then(() => {
            res.status(200).send();
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    return {
        addDoctor: addDoctor,
        validateAccessCode: validateAccessCode,
        addUsernameAndPassword: addUsernameAndPassword,
        getDoctorsList: getDoctorsList,
        getDoctors: getDoctors,
        addDoctorsSchedule: addDoctorsSchedule,
        getDoctorsSchedule: getDoctorsSchedule,
        getDoctorProfile: getDoctorProfile,
        updateDoctorProfile: updateDoctorProfile,
        updateDoctor: updateDoctor,
        deleteDoctor: deleteDoctor,
        updateDoctorSchedule: updateDoctorSchedule,
        deleteDoctorSchedule: deleteDoctorSchedule
    }
};
module.exports = Controller;
