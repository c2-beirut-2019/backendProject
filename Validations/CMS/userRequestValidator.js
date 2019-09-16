let Joi = require('joi');
Joi.objectID = require('joi-objectid')(Joi);
let userValidator = {
    updateUserValidator: {
        option: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            firstName: Joi.string().optional().allow(''),
            lastName: Joi.string().optional().allow(''),
            phoneNumber: Joi.string().optional().allow('')
        }
    }
};
module.exports = userValidator;
