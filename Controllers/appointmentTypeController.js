let Controller = () => {
    let appointmentTypeService = require('../Services/appointmentTypeService')();
    let messagesService = require('../Services/messagesService');

    let getAppointmentTypes = (req, res) => {
        appointmentTypeService.getAppointmentTypes().then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let addAppointmentTypes = (req, res) => {
        appointmentTypeService.addAppointmentType(req.body).then(() => {
            res.status(200).send();
        }).catch(() => {
            res.status(500).send(messagesService.serverError);
        });
    };

    return {
        getAppointmentTypes: getAppointmentTypes,
        addAppointmentTypes: addAppointmentTypes
    }
};
module.exports = Controller;
