let Controller = () => {
    let appointmentService = require('../Services/appointmentService')();
    let messagesService = require('../Services/messagesService');

    let addAppointment = (req, res) => {
        appointmentService.addAppointment(req.user._id, req.body).then(() => {
            res.status(200).send();
        }).catch((err) => {
            if (err === 'not_found') {
                res.status(404).send(messagesService.not_found);
            } else if (err === 'appointment_exists') {
                res.status(409).send(messagesService.appointmentExists);
            } else if (err === 'doctor_not_available') {
                res.status(409).send(messagesService.doctorNotAvailable);
            } else {
                res.status(500).send(messagesService.serverError);
            }
        });
    };

    let getAppointments = (req, res) => {
        appointmentService.getAppointments(req.user._id, req.query.id).then((results) => {
            res.status(200).send(results);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let getUserAppointment = (req, res) => {
        appointmentService.getAppointmentsByType(req.user._id, req.query.doctorID, req.query.pet, req.query.appointmentType, req.query.search, req.query.sortBy, req.query.sortOrder).then((results) => {
            res.status(200).send(results);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let getDoctorsAppointment = (req, res) => {
        appointmentService.getAppointmentsByType(req.query.user, req.doctor._id, req.query.pet, req.query.appointmentType, req.query.search, req.query.sortBy, req.query.sortOrder).then((results) => {
            res.status(200).send(results);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let getAllAppointments = (req, res) => {
        appointmentService.getAppointmentsByType(null, null, null, null, null, null, null, true).then((results) => {
            res.status(200).send(results);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let addCMSAppointment = (req, res) => {
        appointmentService.addAppointment(null, req.body, true).then(() => {
            res.status(200).send();
        }).catch((err) => {
            if (err === 'not_found') {
                res.status(404).send(messagesService.not_found);
            } else if (err === 'appointment_exists') {
                res.status(409).send(messagesService.appointmentExists);
            } else if (err === 'doctor_not_available') {
                res.status(409).send(messagesService.doctorNotAvailable);
            } else {
                res.status(500).send(messagesService.serverError);
            }
        });
    };

    let confirmAppointment = (req, res) => {
        appointmentService.confirmAppointment(req.body.users).then((results) => {
            res.status(200).send(results);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };


    return {
        addAppointment: addAppointment,
        getAppointments: getAppointments,
        getUserAppointment: getUserAppointment,
        getDoctorsAppointment: getDoctorsAppointment,
        getAllAppointments: getAllAppointments,
        addCMSAppointment: addCMSAppointment,
        confirmAppointment:confirmAppointment

    }
};
module.exports = Controller;
