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
    updateClient: {
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
    },
    loginUserValidator: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            grant_type: Joi.string().required(),
            username: Joi.string()
                .when('grant_type', {
                    is: 'password',
                    then: Joi.string().required()
                }),
            password: Joi.string()
                .when('grant_type', {
                    is: 'password',
                    then: Joi.string().required()
                }),
            refresh_token: Joi.string()
                .when('grant_type', {
                    is: 'refresh_token',
                    then: Joi.string().required()
                })
        }
    },
    updateUserProfile: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            firstName: Joi.string().optional(),
            lastName: Joi.string().optional(),
            dateOfBirth: Joi.date().optional().allow(null),
            phoneNumber: Joi.string().optional(),
            emergencyPerson: Joi.string().optional(),
            emergencyNumber: Joi.string().optional(),
            profilePic: Joi.object({
                extension: Joi.string().required(),
                name: Joi.string().required(),
                data: Joi.string().required()
            }).optional()
        }
    },
};
module.exports = clientValidator;
