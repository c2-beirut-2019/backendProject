let Joi = require('joi');
Joi.objectID = require('joi-objectid')(Joi);

let appointmentValidator = {
    addAppointment: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            pet: Joi.objectID().required(),
            doctor: Joi.objectID().required(),
            appointmentType: Joi.objectID().required(),
            startDate: Joi.date().required().min('now'),
        }
    },
    confirmAppointment: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            users: Joi.array().items(Joi.objectID()).required().min(1),
        }
    },
    addCMSAppointment: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            pet: Joi.objectID().required(),
            doctor: Joi.objectID().required(),
            appointmentType: Joi.objectID().required(),
            startDate: Joi.date().required().min('now'),
        }
    }
};
module.exports = appointmentValidator;
