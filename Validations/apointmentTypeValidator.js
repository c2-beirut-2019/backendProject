let Joi = require('joi');
Joi.objectID = require('joi-objectid')(Joi);

let appointmentTypeValidator = {
    addAppointmentType: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            name: Joi.string().required(),
            procedureTime: Joi.number().required(),
        }
    },
    updateAppointmentType: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            name: Joi.string().required(),
            procedureTime: Joi.number().required(),
        }
    }
};
module.exports = appointmentTypeValidator;
