let Controller = () => {
    let appointmentService = require('../Services/appointmentService')();
    let messagesService = require('../Services/messagesService');

    let addAppointment = (req, res) => {
        appointmentService.addAppointment(req.user._id, req.body).then(() => {
            res.status(200).send();
        }).catch((err) => {
            console.log('errr', err);
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

    return {
        addAppointment: addAppointment
    }
};
module.exports = Controller;
