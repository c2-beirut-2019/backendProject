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

    let updateAppointmentTypes = (req, res) => {
        appointmentTypeService.updateAppointmentType(req.params.id, req.body).then(() => {
            res.status(200).send();
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let deleteAppointmentTypes = (req, res) => {
        appointmentTypeService.deleteAppointmentType(req.params.id).then(() => {
            res.status(200).send();
        }).catch((err) => {
            if (err === 'cannotDeleteType') {
                res.status(460).send(messagesService.cannotDeleteType);
            } else {
                res.status(500).send(messagesService.serverError);
            }
        });
    };

    return {
        getAppointmentTypes: getAppointmentTypes,
        addAppointmentTypes: addAppointmentTypes,
        updateAppointmentTypes: updateAppointmentTypes,
        deleteAppointmentTypes: deleteAppointmentTypes
    }
};
module.exports = Controller;
