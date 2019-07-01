let Joi = require('joi');

let clientValidator = {
    addClient: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            dateOfBirth: Joi.date().optional().allow(null),
            phoneNumber: Joi.string().required(),
            referredBy: Joi.string().optional().allow(''),
            emergencyPerson: Joi.string().required(),
            emergencyNumber: Joi.string().required()
        }
    },
    validateCode: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            accessCode: Joi.string().required()
        }
    },
    addUsernameAndPassword: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            accessCode: Joi.string().required(),
            username: Joi.string().required(),
            password: Joi.string().required(),
        }
    }
};
module.exports = clientValidator;
